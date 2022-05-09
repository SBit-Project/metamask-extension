import { connect } from 'react-redux';
import { getSendErrors, getSendAsset, getSbitSpendableBalanceInString, sendSbitAmountIsInError, ASSET_TYPES } from '../../../../../ducks/send';
import SendRowErrorMessage from './send-row-error-message.component';

export default connect(mapStateToProps)(SendRowErrorMessage);

function mapStateToProps(state, ownProps) {
  return {
    errors: getSendErrors(state),
    inErrorSbit: sendSbitAmountIsInError(state),
    errorType: ownProps.errorType,
    sbitBalance: (getSendAsset(state).type === ASSET_TYPES.NATIVE) ? getSbitSpendableBalanceInString(state) : null,
  };
}
