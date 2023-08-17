import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { IamPicker } from '../../../components/Form/iam-picker';
import { AddressDataSource } from '../../../datasources/address';

declare type CityProps = {
  name: string;
  value?: string;
  stateCode?: string;
  description?: string;
  onSel: (value: any | null, row: any, event: any) => void;
};

export class CityPickerPlugin extends Component<CityProps> {
  pickerRef: any = null;

  render() {
    let option = this.props.description;
    if (!option) {
      if (typeof this.props.value === 'string') option = this.props.value;
      else option = '';
    }
    return (
      <>
        <Form.Control autoComplete="off" as="select" name={this.props.name} value={this.props.value} onMouseDown={() => this.pickerRef.show()}>
          <option>{option}</option>
        </Form.Control>
        <Picker
          onSel={this.props.onSel}
          title={'Selecione o Estado'}
          header={['Nome']}
          stateCode={this.props.stateCode}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

class Picker extends IamPicker<{ stateCode?: string }> {
  stateCode: any;
  lastSearch?: string;

  search = () => {
    if ((this.lastSearch !== this.state.search && this.state.search.length > 3) || this.props.stateCode !== this.stateCode) {
      this.setOptions([]);

      new AddressDataSource()
        .findCity(this.props.stateCode, this.state.search)
        .then((response) => {
          const options = response.data.map((result: any) => ({
            value: result,
            columns: [result.name],
          }));

          this.setOptions(options);
        })
        .catch(() => {});
    }

    this.stateCode = this.props.stateCode;
    this.lastSearch = this.state.search;
  };
}
