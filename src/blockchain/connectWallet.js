// import Torus from '@toruslabs/torus-embed';
// import Portis from '@portis/web3';
import store from '../store/store';
import constant from '../../constant';
let Web3modal = '';
let Web3 = '';
let WalletConnectProvider = '';
let web3;

async function loadLibrary() {
  Web3modal = await import('web3modal').then((obj) => obj.default);
  Web3 = await import('web3').then((obj) => obj.default);
  WalletConnectProvider = await import('@walletconnect/web3-provider').then(
    (obj) => obj.default
  );
}

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: constant.infuraId,
      },
    },
  };
  web3Modal = new Web3modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  console.log('Web3Modal instance is', web3Modal);
}

async function fetchAccountData() {
  // Get a Web3 instance for the wallet
  web3 = new Web3(provider);

  console.log('Web3 instance is', web3);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log('Got accounts', accounts);
  selectedAccount = accounts[0];

  // set account address in state
  store.commit('CONNECT', selectedAccount);
}
async function onConnect() {
  await loadLibrary();
  init();
  try {
    const modalElement = document.getElementById(
      'WEB3_CONNECT_MODAL_ID'
    ).firstChild;
    modalElement.style.zIndex = 300000;
    if (store.state.insideIframe) {
      modalElement.style.height = '100%';
      modalElement.style.width = '100%';
      modalElement.style.transform = 'translate(-136px,0px)';
    }
    provider = await web3Modal.connect();
  } catch (e) {
    console.log('Could not get a wallet connection', e);
    return;
  }
  console.log(84);
  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    fetchAccountData();
    /*  connectToOceanMarketPlace(provider);  */
  });
  console.log(90);
  /* Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  }); */

  // Subscribe to networkId change
  console.log(97);
  provider.on('networkChanged', (networkId) => {
    fetchAccountData();
  });
  console.log(101);
  // await refreshAccountData();
  // await connectToOceanMarketPlace(provider);
  // publishContent(provider)
  await fetchAccountData();
}

async function onBuy() {
  /* buyContent(provider); */
}

async function onDisconnect() {
  await web3Modal.clearCachedProvider();
  provider = null;
  selectedAccount = null;
}

export { onConnect, onDisconnect, onBuy, selectedAccount, web3 };
