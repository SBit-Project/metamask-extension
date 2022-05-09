import { debounce } from 'lodash';
import { connect } from 'react-redux';
import {
  lookupEnsName,
  initializeEnsSlice,
  resetEnsResolution,
} from '../../../../ducks/ens';
import EnsInput from './ens-input.component';
import { getSbitAddressBook, isSbitAddressShow } from '../../../../ducks/metamask/metamask';

function mapStateToProps(state) {
  const sbitAddressBook = getSbitAddressBook(state);
  const isSbitAddressShowCheck = isSbitAddressShow(state);
  const {
    metamask: {
      provider: { chainId },
    },
  } = state;

  return {
    chainId,
    sbitAddressBook,
    isSbitAddressShowCheck,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    lookupEnsName: debounce((ensName) => dispatch(lookupEnsName(ensName)), 150),
    initializeEnsSlice: () => dispatch(initializeEnsSlice()),
    resetEnsResolution: debounce(() => dispatch(resetEnsResolution()), 300),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnsInput);
