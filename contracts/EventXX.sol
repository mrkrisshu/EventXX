// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EventXX - Decentralized Event Ticketing Platform
 * @dev NFT-based ticketing system with fraud prevention and resale marketplace
 */
contract EventXX is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _eventIds;
    Counters.Counter private _ticketIds;
    
    // Platform fee (2.5%)
    uint256 public platformFeePercentage = 250; // 250 = 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    struct Event {
        uint256 eventId;
        address organizer;
        string name;
        string description;
        string imageUri;
        string venue;
        uint256 startTime;
        uint256 endTime;
        uint256 ticketPrice;
        uint256 maxTickets;
        uint256 ticketsSold;
        bool isActive;
        bool allowResale;
        uint256 resaleFeePercentage; // Organizer's resale fee
    }
    
    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        address originalBuyer;
        address currentOwner;
        string seatNumber;
        bool isUsed;
        bool isTransferable;
        uint256 purchasePrice;
        uint256 resalePrice;
    }
    
    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public eventTickets; // eventId => ticketIds
    mapping(address => uint256[]) public organizerEvents;
    mapping(address => uint256[]) public userTickets;
    
    // Events
    event EventCreated(uint256 indexed eventId, address indexed organizer, string name);
    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address indexed buyer);
    event TicketUsed(uint256 indexed ticketId, uint256 indexed eventId);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to, uint256 price);
    event EventUpdated(uint256 indexed eventId, bool isActive);
    
    constructor() ERC721("EventXX Tickets", "EVTX") {}
    
    /**
     * @dev Create a new event
     */
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _imageUri,
        string memory _venue,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _ticketPrice,
        uint256 _maxTickets,
        bool _allowResale,
        uint256 _resaleFeePercentage
    ) external returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_maxTickets > 0, "Max tickets must be greater than 0");
        require(_resaleFeePercentage <= 1000, "Resale fee cannot exceed 10%");
        
        _eventIds.increment();
        uint256 eventId = _eventIds.current();
        
        events[eventId] = Event({
            eventId: eventId,
            organizer: msg.sender,
            name: _name,
            description: _description,
            imageUri: _imageUri,
            venue: _venue,
            startTime: _startTime,
            endTime: _endTime,
            ticketPrice: _ticketPrice,
            maxTickets: _maxTickets,
            ticketsSold: 0,
            isActive: true,
            allowResale: _allowResale,
            resaleFeePercentage: _resaleFeePercentage
        });
        
        organizerEvents[msg.sender].push(eventId);
        
        emit EventCreated(eventId, msg.sender, _name);
        return eventId;
    }
    
    /**
     * @dev Purchase a ticket for an event
     */
    function purchaseTicket(
        uint256 _eventId,
        string memory _seatNumber,
        string memory _tokenUri
    ) external payable nonReentrant returns (uint256) {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(event_.ticketsSold < event_.maxTickets, "Event is sold out");
        require(block.timestamp < event_.startTime, "Event has already started");
        require(msg.value >= event_.ticketPrice, "Insufficient payment");
        
        _ticketIds.increment();
        uint256 ticketId = _ticketIds.current();
        
        // Mint NFT ticket
        _safeMint(msg.sender, ticketId);
        _setTokenURI(ticketId, _tokenUri);
        
        // Create ticket record
        tickets[ticketId] = Ticket({
            ticketId: ticketId,
            eventId: _eventId,
            originalBuyer: msg.sender,
            currentOwner: msg.sender,
            seatNumber: _seatNumber,
            isUsed: false,
            isTransferable: event_.allowResale,
            purchasePrice: event_.ticketPrice,
            resalePrice: 0
        });
        
        // Update mappings
        eventTickets[_eventId].push(ticketId);
        userTickets[msg.sender].push(ticketId);
        event_.ticketsSold++;
        
        // Handle payment
        uint256 platformFee = (event_.ticketPrice * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 organizerPayment = event_.ticketPrice - platformFee;
        
        // Transfer payment to organizer
        payable(event_.organizer).transfer(organizerPayment);
        
        // Refund excess payment
        if (msg.value > event_.ticketPrice) {
            payable(msg.sender).transfer(msg.value - event_.ticketPrice);
        }
        
        emit TicketMinted(ticketId, _eventId, msg.sender);
        return ticketId;
    }
    
    /**
     * @dev Transfer ticket to another user (resale)
     */
    function transferTicket(
        uint256 _ticketId,
        address _to,
        uint256 _price
    ) external payable nonReentrant {
        require(ownerOf(_ticketId) == msg.sender, "Not ticket owner");
        require(_to != address(0), "Invalid recipient");
        require(_to != msg.sender, "Cannot transfer to yourself");
        
        Ticket storage ticket = tickets[_ticketId];
        Event storage event_ = events[ticket.eventId];
        
        require(ticket.isTransferable, "Ticket is not transferable");
        require(!ticket.isUsed, "Ticket has been used");
        require(block.timestamp < event_.startTime, "Event has already started");
        require(msg.value >= _price, "Insufficient payment");
        
        // Calculate fees
        uint256 platformFee = (_price * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 organizerFee = (_price * event_.resaleFeePercentage) / FEE_DENOMINATOR;
        uint256 sellerPayment = _price - platformFee - organizerFee;
        
        // Update ticket ownership
        ticket.currentOwner = _to;
        ticket.resalePrice = _price;
        
        // Update user tickets mapping
        userTickets[_to].push(_ticketId);
        
        // Transfer NFT
        _transfer(msg.sender, _to, _ticketId);
        
        // Handle payments
        payable(msg.sender).transfer(sellerPayment);
        payable(event_.organizer).transfer(organizerFee);
        
        // Refund excess payment
        if (msg.value > _price) {
            payable(msg.sender).transfer(msg.value - _price);
        }
        
        emit TicketTransferred(_ticketId, msg.sender, _to, _price);
    }
    
    /**
     * @dev Mark ticket as used (for event entry)
     */
    function useTicket(uint256 _ticketId) external {
        Ticket storage ticket = tickets[_ticketId];
        Event storage event_ = events[ticket.eventId];
        
        require(
            msg.sender == event_.organizer || msg.sender == owner(),
            "Only organizer or admin can mark ticket as used"
        );
        require(!ticket.isUsed, "Ticket has already been used");
        require(
            block.timestamp >= event_.startTime && block.timestamp <= event_.endTime,
            "Event is not currently active"
        );
        
        ticket.isUsed = true;
        
        emit TicketUsed(_ticketId, ticket.eventId);
    }
    
    /**
     * @dev Update event status
     */
    function updateEventStatus(uint256 _eventId, bool _isActive) external {
        Event storage event_ = events[_eventId];
        require(
            msg.sender == event_.organizer || msg.sender == owner(),
            "Only organizer or admin can update event"
        );
        
        event_.isActive = _isActive;
        
        emit EventUpdated(_eventId, _isActive);
    }
    
    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Update platform fee percentage (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 500, "Platform fee cannot exceed 5%");
        platformFeePercentage = _newFeePercentage;
    }
    
    // View functions
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }
    
    function getTicket(uint256 _ticketId) external view returns (Ticket memory) {
        return tickets[_ticketId];
    }
    
    function getEventTickets(uint256 _eventId) external view returns (uint256[] memory) {
        return eventTickets[_eventId];
    }
    
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }
    
    function getOrganizerEvents(address _organizer) external view returns (uint256[] memory) {
        return organizerEvents[_organizer];
    }
    
    function getTotalEvents() external view returns (uint256) {
        return _eventIds.current();
    }
    
    function getTotalTickets() external view returns (uint256) {
        return _ticketIds.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}