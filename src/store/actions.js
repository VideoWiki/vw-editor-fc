import { onConnect, onDisconnect, web3 } from '../blockchain/connectWallet';
import axios from 'axios';
import store from './store';
import { downloadFile, getAccessDetails, order } from '../blockchain/Download';
import { PUBLISHVIDEOS } from '../blockchain/OceanMarket';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import constants from '../../constant';
import { ethers } from 'ethers';

const polyABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_price', type: 'uint256' },
    ],
    name: 'listOnMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'marketplace',
    outputs: [
      { internalType: 'bool', name: 'listing', type: 'bool' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'address', name: 'publisher', type: 'address' },
      { internalType: 'uint256', name: 'royalty', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_tokenURI', type: 'string' },
      { internalType: 'uint256', name: 'royalty', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'removeFromMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'walletOfOwner',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const polyContractAddress = '0xAdC7a6742e2170fb1b48590dc11A5f8dC77EeA21';

const filebaseAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_price', type: 'uint256' },
    ],
    name: 'listOnMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_tokenURI', type: 'string' },
      { internalType: 'uint256', name: 'royalty', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'removeFromMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'marketplace',
    outputs: [
      { internalType: 'bool', name: 'listing', type: 'bool' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'address', name: 'publisher', type: 'address' },
      { internalType: 'uint256', name: 'royalty', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'walletOfOwner',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const filebaseContractAddress = '0xbDF461E1ff0587F97a34a9b19f3c97093Fb7BEB4';

const actions = {
  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width);
  },

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit('UPDATE_STARRED_PAGE', payload);
  },

  // The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_LIMITED', list);
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_MORE', list);
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY');
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val);
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    commit('UPDATE_USER_INFO', payload);
  },
  async connectWallet({ commit }) {
    try {
      await onConnect();
    } catch (err) {
      console.log(err);
    }
  },

  async disconnectWallet({ commit }) {
    try {
      await onDisconnect();
      commit('DISCONNECT');
    } catch (err) {
      console.log(err);
    }
  },
  async getDownloadStatus({ commit }, payload) {
    const newCancelToken = axios.CancelToken.source();
    const token = newCancelToken.token;
    try {
      const response = await axios.get(
        `https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/${payload.did}`,
        { token }
      );
      if (!response || response.status !== 200 || !response.data) return;

      var data = { ...response.data };
      const accessDetails = await getAccessDetails(
        data.chainId,
        data.services[0].datatokenAddress,
        data.services[0].timeout,
        payload.accountAddress
      );
      data = {
        ...data,
        accessDetails,
      };
      store.commit('SET_ASSET', data);
      if (data.accessDetails.validOrderTx) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(error.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async publishToOcean({ commit }, payload) {
    try {
      payload.user.accountId = store.state.accountAddress;
      const videoTxData = await PUBLISHVIDEOS(web3, payload);
      commit('studio/setTxData', videoTxData);
      return true;
    } catch (e) {
      console.log('Oh noooo', e);
      return false;
    }
  },
  async initiateBuy({ commit }, exchangeId) {
    try {
      await order(web3, store.state.asset, store.state.accountAddress);
    } catch (e) {
      console.log({ buyContentError: e });
      throw e;
    }
  },
  async startDownload({ commit }, payload) {
    try {
      await downloadFile(
        web3,
        store.state.asset,
        store.state.accountAddress,
        store.state.asset.accessDetails.validOrderTx
      );
    } catch (e) {
      console.log({ downloadContentErro: e });
      throw e;
    }
  },

  async purchase({ commit }, payload) {
    switch (payload.type) {
      case 'none':
        payload.abi = polyABI;
        payload.contractAddress = polyContractAddress;
        await actions.purchaseVideo(payload);
        break;
      case 'filebase':
        payload.abi = filebaseAbi;
        payload.contractAddress = filebaseContractAddress;
        await actions.purchaseVideo(payload);
        break;
      default:
        await actions.initiateBuy();
    }
  },

  async mint({ commit }, payload) {
    switch (payload.type) {
      case 'none':
        payload.abi = polyABI;
        payload.contractAddress = polyContractAddress;
        var res = await actions.mintVideo(commit, payload);
        return res;
      case 'filebase':
        payload.abi = filebaseAbi;
        payload.contractAddress = filebaseContractAddress;
        res = await actions.mintVideo(commit, payload);
        return res;
      default:
        await actions.initiateBuy();
    }
  },

  async ownerOf({ commit }, payload) {
    var res;
    switch (payload.type) {
      case 'none':
        payload.abi = polyABI;
        payload.contractAddress = polyContractAddress;
        res = await actions.ownerOfVideo(payload);
        return res;
      case 'filebase':
        payload.abi = filebaseAbi;
        payload.contractAddress = filebaseContractAddress;
        res = await actions.ownerOfVideo(payload);
        return res;
      default:
        await actions.initiateBuy();
    }
  },

  async tokenuri({ commit }, payload) {
    var res;
    switch (payload.type) {
      case 'none':
        payload.abi = polyABI;
        payload.contractAddress = polyContractAddress;
        res = await actions.tokenuriVideo(payload);
        return res;
      case 'filebase':
        payload.abi = filebaseAbi;
        payload.contractAddress = filebaseContractAddress;
        res = await actions.tokenuriVideo(payload);
        return res;
      default:
        await actions.initiateBuy();
    }
  },

  async getPreviewUrl(
    client,
    { video, title, description, name, walletAddress, avatar }
  ) {
    try {
      const res = await axios.post(
        constants.apiUrl + '/api/speed_up_video/',
        video
      );
      const response = await fetch(res.data.data.video_url);
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const file = new File([blob], 'PREVIEW.mp4', { contentType });
      const metadata = { title, description, name, walletAddress, avatar };
      const BLOB = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      const metadataFile = new File([BLOB], 'metadata.json');
      const imgCID = await client.put([file, metadataFile], {
        name: file.name,
      });
      return `https://${imgCID}.ipfs.w3s.link/`;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async getVideoMetadataUrl(client, { title, description, url }) {
    const metadata = {
      title,
      description,
      url,
    };
    const BLOB = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const metadataFile = new File([BLOB], 'metadata.json');
    const imgCID = await client.put([metadataFile]);
    return `https://${imgCID}.ipfs.w3s.link/`;
  },

  async load({ commit }, payload) {
    const client = await new Web3Storage({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxZUMxQTlhMDc5NDNlQjBjMTcwQWZhMjcxNTY4MTg4NDA5YzAyRWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzA5NDQ2OTA5MjUsIm5hbWUiOiJiZWx1Z2EifQ.A2JdUCF0vKXJXGlaTKJ1pBNIDLT2MWa4m8OGHpCWfIA',
    });
    if (payload.url) {
      const url = await actions.getVideoMetadataUrl(client, payload);
      console.log(url);
      return url;
    }
    const RES = await actions.getPreviewUrl(client, payload);
    return RES;
  },
  async mintVideo(commit, payload) {
    // pass a signer to create a contract instance for state changing operations
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const abi = payload.abi;
    const contractAddress = payload.contractAddress;
    var contract = new ethers.Contract(contractAddress, abi, signer);
    const uri = payload.url;
    const royalty = 5;
    var tx = await contract.mint(uri, royalty);
    // wait for the transaction to be mined
    await tx.wait();
    contract = new ethers.Contract(contractAddress, abi, provider);
    var _tokenId;
    tx = await contract.walletOfOwner(payload.walletAddress);
    _tokenId = tx[tx.length - 1]._hex;
    // Putting it marketplace
    contract = new ethers.Contract(contractAddress, abi, signer);
    const _price = ethers.utils.parseEther('0.0008');
    tx = await contract.listOnMarketplace(_tokenId, _price);
    // wait for the transaction to be mined
    await tx.wait();
    commit('studio/setTxData', {
      id: _tokenId,
      nftAddress: 'doe',
      services: [{ datatokenAddress: payload.type }],
    });
    return true;
  },
  async purchaseVideo(payload) {
    // pass a signer to create a contract instance for state changing operations
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const abi = payload.abi;
    const contractAddress = payload.contractAddress;
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const _tokenId = payload.tokenId;
    const _price = ethers.utils.parseEther('0.0008');

    const tx = await contract.purchase(_tokenId, { value: _price });

    // wait for the transaction to be mined
    await tx.wait();
  },
  async ownerOfVideo(payload) {
    console.log(payload);
    // pass a signer to create a contract instance for state changing operations
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const abi = payload.abi;
    const contractAddress = payload.contractAddress;
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const _tokenId = payload.tokenId;
    console.log(payload.contractAddress);
    const tx = await contract.ownerOf(_tokenId);
    console.log(tx);

    return tx === payload.walletAddress;
  },
  async tokenuriVideo(payload) {
    // pass a signer to create a contract instance for state changing operations
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const abi = payload.abi;
    const contractAddress = payload.contractAddress;
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const _tokenId = payload.tokenId;
    const tx = await contract.tokenURI(_tokenId);
    return tx;
  },
  // async initialiseBundlr({ commit }, payload) {
  //   await window.ethereum.enable();

  //   const provider = new providers.Web3Provider(window.ethereum);
  //   await provider._ready();

  //   const bundlr = new WebBundlr(
  //     'https://devnet.bundlr.network',
  //     'matic',
  //     provider,
  //     {
  //       providerUrl: 'https://rpc-mumbai.matic.today',
  //     }
  //   );
  //   await bundlr.ready();
  //   var bal = await bundlr.getLoadedBalance();
  //   bal = utils.formatEther(bal.toString());
  //   if (bal < 0.02) {
  //     const amountParsed = actions.parseInput(0.1, bundlr);
  //     let res = await bundlr.fund(amountParsed);
  //   }
  //   const response = await fetch(payload);
  //   const contentType = response.headers.get('content-type');
  //   const uploader = bundlr.uploader.chunkedUploader;
  //   uploader.setBatchSize(10);
  //   const chunkSize = 2000000;
  //   uploader.setChunkSize(chunkSize);
  //   const blob = await response.blob();
  //   const file = new File([blob], 'PREVIEW.webm', { contentType });
  //   const fileSize = file.size;
  //   // if (fileSize < chunkSize) totalChunks.current = 1;
  //   // else {
  //   //   totalChunks.current = Math.floor(fileSize / chunkSize);
  //   // }
  //   const dataStream = fileReaderStream(file);
  //   const tx = await uploader.uploadData(dataStream, [
  //     { name: 'Content-Type', value: 'video/webm' },
  //   ]);
  //   // console.log(`http://arweave.net/${tx.data.id}`);
  //   return `http://arweave.net/${tx.data.id}`;
  //   // fetchBalance();
  // },
  // parseInput(input, bundlr) {
  //   const conv = new BigNumber(input).multipliedBy(
  //     bundlr.currencyConfig.base[1]
  //   );
  //   if (conv.isLessThan(1)) {
  //     console.log('error: value too small');
  //     return null;
  //   } else {
  //     return conv;
  //   }
  // },
};

export default actions;
