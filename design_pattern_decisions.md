## Design designs

#### Restricting access

I have implemented some modifiers and private state variables so as to make sure that
  - only the deployer of the contract (myself) is able to set one important variable in AuctionNft.sol for the former
  - other contracts are restricted from accessing the contract's state for the latter

#### Fail early and fail loud

I have implemented multiple require statements to make sure transfer of ether or NFT are only possible a specific number of times and under specific auction status.

The require function enables to throw an exception if the condition is not met. My tests also cover catchRevert in order to verify the throw when running "truffle test".

#### Pull over Push payments

This design is also detailled under document "avoiding_common_attacks.md". This design is important to avoid reentrancy attacks.

As our smart contract is dealing with ether and NFT transfer, a withdrawal pattern was implemented so that ether and NFT transfer can only be enabled once requested by the user through an external call.

#### Circuit Breaker


Circuit breaker is a design patter enabling certain functionalities to be stopped in case of emergency (bug found for instance).

I have implemented a circuit breaker that only the contract creator can toggle in case a bug was found around the withdrawBid and withdrawHighestBid functions.

This is to make sure that the funds of the users are safe.
