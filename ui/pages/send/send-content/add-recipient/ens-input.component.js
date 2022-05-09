import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isHexString } from 'ethereumjs-util';

import { isValidDomainName, getHexAddressFromSbit, getSbitAddressFromHex } from '../../../../helpers/utils/util';
import {
  isBurnAddress,
  isValidHexAddress,
} from '../../../../../shared/modules/hexstring-utils';

export default class EnsInput extends Component {

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    className: PropTypes.string,
    chainId: PropTypes.string,
    selectedAddress: PropTypes.string,
    sbitAddressBook: PropTypes.object,
    isSbitAddressShowCheck: PropTypes.bool,
    selectedName: PropTypes.string,
    scanQrCode: PropTypes.func,
    onPaste: PropTypes.func,
    onValidAddressTyped: PropTypes.func,
    internalSearch: PropTypes.bool,
    userInput: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    lookupEnsName: PropTypes.func.isRequired,
    initializeEnsSlice: PropTypes.func.isRequired,
    resetEnsResolution: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initializeEnsSlice();
  }

  isBase58 = (value) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);

  onPaste = (event) => {
    if (event.clipboardData.items?.length) {
      const clipboardItem = event.clipboardData.items[0];
      clipboardItem?.getAsString((text) => {
        const input = text.trim();
        let hexAddress = input;
        if(this.isBase58(input) || !isHexString(input)) {
          hexAddress = getHexAddressFromSbit(input);
        } 
        if (
          !isBurnAddress(hexAddress) &&
          isValidHexAddress(hexAddress, { mixedCaseUseChecksum: true })
        ) {
          this.props.onPaste(hexAddress);
        }

      });
    }
  };

  onChange = ({ target: { value } }) => {
    const {
      onValidAddressTyped,
      internalSearch,
      onChange,
      lookupEnsName,
      resetEnsResolution,
    } = this.props;
    const input = value.trim();
    let hexAddress = input;
    if (this.isBase58(input) || !isHexString(input)) {
      hexAddress = getHexAddressFromSbit(input);
    }
    onChange(hexAddress);

    if (internalSearch) {
      return null;
    }
    // Empty ENS state if input is empty
    // maybe scan ENS
    if (isValidDomainName(hexAddress)) {
      lookupEnsName(hexAddress);
    } else {
      resetEnsResolution();

      if (
        onValidAddressTyped &&
        !isBurnAddress(hexAddress) &&
        isValidHexAddress(hexAddress, { mixedCaseUseChecksum: true })
      ) {
        onValidAddressTyped(hexAddress);
      }
    }

    return null;
  };

  convertAddress = (input) => {
    const { chainId, isSbitAddressShowCheck } = this.props;
    if (isSbitAddressShowCheck && isHexString(input) && input !== '') {
      const newAddress = getSbitAddressFromHex(input, chainId);
      return newAddress;
    } else if (!isSbitAddressShowCheck && this.isBase58(input) && input !== '') {
      const newAddress = getHexAddressFromSbit(input);
      return newAddress;
    }
    return input;
  }

  render() {
    const { t } = this.context;
    const { className, selectedAddress, selectedName, userInput, sbitAddressBook, isSbitAddressShowCheck } = this.props;

    const hasSelectedAddress = Boolean(selectedAddress);

    return (
      <div className={classnames('ens-input', className)}>
        <div
          className={classnames('ens-input__wrapper', {
            'ens-input__wrapper__status-icon--error': false,
            'ens-input__wrapper__status-icon--valid': false,
            'ens-input__wrapper--valid': hasSelectedAddress,
          })}
        >
          <div
            className={classnames('ens-input__wrapper__status-icon', {
              'ens-input__wrapper__status-icon--valid': hasSelectedAddress,
            })}
          />
          {hasSelectedAddress ? (
            <>
              <div className="ens-input__wrapper__input ens-input__wrapper__input--selected">
                <div className="ens-input__selected-input__title">
                  {this.convertAddress(selectedName) || (isSbitAddressShowCheck ? sbitAddressBook[selectedAddress] : this.convertAddress(selectedAddress))}
                </div>
                {selectedName !== selectedAddress && (
                  <div className="ens-input__selected-input__subtitle">
                    {isSbitAddressShowCheck ? sbitAddressBook[selectedAddress] : selectedAddress}
                  </div>
                )}
              </div>
              <div
                className="ens-input__wrapper__action-icon ens-input__wrapper__action-icon--erase"
                onClick={this.props.onReset}
              />
            </>
          ) : (
            <>
              <input
                className="ens-input__wrapper__input"
                type="text"
                dir="auto"
                placeholder={t('recipientAddressPlaceholder')}
                onChange={this.onChange}
                onPaste={this.onPaste}
                spellCheck="false"
                value={this.convertAddress(selectedAddress) || this.convertAddress(userInput)}
                autoFocus
                data-testid="ens-input"
              />
              <button
                className={classnames('ens-input__wrapper__action-icon', {
                  'ens-input__wrapper__action-icon--erase': userInput,
                  'ens-input__wrapper__action-icon--qrcode': !userInput,
                })}
                onClick={() => {
                  if (userInput) {
                    this.props.onReset();
                  } else {
                    this.props.scanQrCode();
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
