class Block {
    constructor(index, timestamp, data, previousHash = '') {
      this.index = index;
      this.timestamp = timestamp;
      this.data = data;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      return btoa(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash);
    }
  }
  
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
  
    createGenesisBlock() {
      return new Block(0, new Date().toISOString(), { message: "Genesis Block" }, "0");
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    addBlock(newBlock) {
      newBlock.previousHash = this.getLatestBlock().hash;
      newBlock.hash = newBlock.calculateHash();
      this.chain.push(newBlock);
    }
  
    isChainValid() {
      for (let i = 1; i < this.chain.length; i++) {
        const curr = this.chain[i];
        const prev = this.chain[i - 1];
  
        if (curr.hash !== curr.calculateHash()) return false;
        if (curr.previousHash !== prev.hash) return false;
      }
      return true;
    }
  }
  
  // Initialize
  const blockchain = new Blockchain();
  const form = document.getElementById('txForm');
  const output = document.getElementById('chainOutput');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;
    const amount = parseFloat(document.getElementById('amount').value);
  
    // Basic fraud check
    if (amount <= 0 || sender === receiver) {
      alert("Invalid transaction: Fraud detected.");
      return;
    }
  
    const newBlock = new Block(
      blockchain.chain.length,
      new Date().toISOString(),
      { sender, receiver, amount }
    );
  
    blockchain.addBlock(newBlock);
    form.reset();
    displayChain();
    const msg = document.getElementById('confirmationMsg');
msg.style.display = 'block';
msg.style.animation = 'fadeOut 2s ease-in-out forwards';
setTimeout(() => {
  msg.style.display = 'none';
}, 2000);
  });
  
  function displayChain() {
    document.getElementById('chainOutput').textContent = JSON.stringify(blockchain.chain, null, 2);
  
    const niceDiv = document.getElementById('niceOutput');
    niceDiv.innerHTML = ''; // Clear previous output
  
    blockchain.chain.forEach((block, index) => {
      const date = new Date(block.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      if (index === 0) return; // Hide Genesis Block from readable transactions

const { sender, receiver, amount } = block.data;

niceDiv.innerHTML += `
  <div class="block-card">
    <div class="title">${sender} sent $${amount} to ${receiver}</div>
    <div class="meta">on ${date}</div>
  </div>
`;
    });
  }
  // Dark mode toggle button logic
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});