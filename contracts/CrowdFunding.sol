// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }
    mapping(uint256 => Campaign) public s_campaigns;

    uint256 public s_numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        Campaign storage campaign = s_campaigns[s_numberOfCampaigns];
        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.deadline = _deadline;
        campaign.target = _target;
        campaign.amountCollected = 0;
        s_numberOfCampaigns++;
        return s_numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = s_campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) campaign.amountCollected += amount;
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (s_campaigns[_id].donators, s_campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](s_numberOfCampaigns);
        for (uint i = 0; i < s_numberOfCampaigns; i++) {
            Campaign storage item = s_campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
