const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IPFSStorage", function () {
  let ipfsStorage;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
    ipfsStorage = await IPFSStorage.deploy();
    await ipfsStorage.waitForDeployment();
  });

  describe("Adding CIDs", function () {
    it("Should add a CID successfully", async function () {
      const cid = "QmTest123";
      await expect(ipfsStorage.connect(addr1).addCid(cid))
        .to.emit(ipfsStorage, "CidAdded")
        .withArgs(addr1.address, cid);
      
      const cids = await ipfsStorage.getUserCids(addr1.address);
      expect(cids).to.include(cid);
    });
  });

  describe("Retrieving CIDs", function () {
    it("Should return correct number of CIDs", async function () {
      const cids = ["QmTest1", "QmTest2", "QmTest3"];
      
      for (const cid of cids) {
        await ipfsStorage.connect(addr1).addCid(cid);
      }
      
      const count = await ipfsStorage.getUserCidCount(addr1.address);
      expect(count).to.equal(cids.length);
    });

    it("Should return correct CID by index", async function () {
      const cids = ["QmTest1", "QmTest2", "QmTest3"];
      
      for (const cid of cids) {
        await ipfsStorage.connect(addr1).addCid(cid);
      }
      
      const cidAtIndex = await ipfsStorage.getUserCidByIndex(addr1.address, 1);
      expect(cidAtIndex).to.equal(cids[1]);
    });

    it("Should throw error for out of bounds index", async function () {
      await expect(
        ipfsStorage.getUserCidByIndex(addr1.address, 0)
      ).to.be.revertedWith("Index out of bounds");
    });
  });
}); 