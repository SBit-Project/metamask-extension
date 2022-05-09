import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  getValueFromWeiHex,
} from '../../../../../helpers/utils/conversions.util';
import { SBIT } from '../../../../../helpers/constants/common';

export default class SendRowErrorMessage extends Component {
  static propTypes = {
    errors: PropTypes.object,
    errorType: PropTypes.string,
    sbitBalance: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  getDecimalValue(props) {
    const { sbitBalance: hexValue } = props;
    const decimalValueString = getValueFromWeiHex({
      value: hexValue,
      fromCurrency: SBIT,
      toCurrency: SBIT,
      numberOfDecimals: 6,
    });

    return Number(decimalValueString) || 0;
  }

  render() {
    const { errors, inErrorSbit, errorType, sbitBalance } = this.props;

    const errorMessage = errors[errorType];

    return errorMessage ? (
      <div
        className={classnames('send-v2__error', {
          'send-v2__error-amount': errorType === 'amount',
        })}
      >
        {this.context.t(errorMessage)} {sbitBalance !== null && inErrorSbit ? `${this.context.t(errors.sbitBalances)} ${this.getDecimalValue(this.props)} ${SBIT}` : ''}
      </div>
    ) : null;
  }
}
