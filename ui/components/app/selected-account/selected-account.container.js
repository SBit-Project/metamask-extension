import { connect } from 'react-redux';
import { getSelectedIdentity } from '../../../selectors';
import { getSbitAddress, isSbitAddressShow } from '../../../ducks/metamask/metamask';
import SelectedAccount from './selected-account.component';

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
    sbitAddress: getSbitAddress(state, getSelectedIdentity(state).address),
    isSbitAddressShow: isSbitAddressShow(state),
  };
};

export default connect(mapStateToProps)(SelectedAccount);
