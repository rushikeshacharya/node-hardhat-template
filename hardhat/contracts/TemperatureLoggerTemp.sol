// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TemperatureLogger {
    struct Reading {
        int256 temperature;
        string unit; // "C" or "F"
        string latitude;
        string longitude;
        bool exists;
    }

    // mapping: timestamp => locationHash => Reading
    mapping(uint256 => mapping(bytes32 => Reading)) private readings;

    address public owner;

    event ReadingStored(
        uint256 indexed timestamp,
        int256 temperature,
        string unit,
        string latitude,
        string longitude
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storeReading(
        uint256 timestamp,
        int256 temperature,
        string calldata unit,
        string calldata latitude,
        string calldata longitude
    ) external onlyOwner {
        bytes32 locationHash = keccak256(abi.encodePacked(latitude, longitude));

        require(
            !readings[timestamp][locationHash].exists,
            "Reading already exists for timestamp+location"
        );

        readings[timestamp][locationHash] = Reading(
            temperature,
            unit,
            latitude,
            longitude,
            true
        );

        emit ReadingStored(timestamp, temperature, unit, latitude, longitude);
    }

    function getReading(
        uint256 timestamp,
        string calldata latitude,
        string calldata longitude
    )
        external
        view
        returns (
            int256 temperature,
            string memory unit,
            string memory lat,
            string memory lon
        )
    {
        bytes32 locationHash = keccak256(abi.encodePacked(latitude, longitude));
        Reading storage r = readings[timestamp][locationHash];
        require(r.exists, "No reading found for timestamp+location");
        return (r.temperature, r.unit, r.latitude, r.longitude);
    }
}
