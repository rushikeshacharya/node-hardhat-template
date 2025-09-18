// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TemperatureLogger {
    struct ReadingMeta {
        bytes32 dataHash; // keccak256 of the canonical off-chain JSON
        bool exists;
    }

    // sensorId => timestamp => ReadingMeta
    mapping(string => mapping(uint256 => ReadingMeta)) private readings;

    address public owner;

    event ReadingStored(
        string indexed sensorId,
        uint256 indexed timestamp,
        bytes32 dataHash,
        address indexed committer
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Store the keccak256 hash of an off-chain reading for a sensor & timestamp
    /// @dev Prevents overwrite of an existing entry
    function storeReading(
        string calldata sensorId,
        uint256 timestamp,
        bytes32 dataHash
    ) external onlyOwner {
        require(!readings[sensorId][timestamp].exists, "Already exists");
        readings[sensorId][timestamp] = ReadingMeta(dataHash, true);
        emit ReadingStored(sensorId, timestamp, dataHash, msg.sender);
    }

    /// @notice Get the stored dataHash for sensor/timestamp
    function getReadingMeta(
        string calldata sensorId,
        uint256 timestamp
    ) external view returns (bytes32) {
        require(readings[sensorId][timestamp].exists, "Not found");
        return readings[sensorId][timestamp].dataHash;
    }

    /// @notice Check existence without revert
    function exists(
        string calldata sensorId,
        uint256 timestamp
    ) external view returns (bool) {
        return readings[sensorId][timestamp].exists;
    }

    /// @notice Allow ownership transfer if required
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero addr");
        owner = newOwner;
    }
}

