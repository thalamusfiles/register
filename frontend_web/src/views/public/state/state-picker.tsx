import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { IamPicker } from '../../../components/Form/iam-picker';
import { AddressDataSource } from '../../../datasources/address';

declare type StateProps = {
  name: string;
  value?: string;
  description?: string;
  onSel: (value: any | null, row: any, event: any) => void;
};

export class StatePickerPlugin extends Component<StateProps> {
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
        <ApplicationPicker
          onSel={this.props.onSel}
          title={'Selecione o Estado'}
          header={['Nome']}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class ApplicationPicker extends IamPicker {
  componentDidMount() {
    super.componentDidMount();

    new AddressDataSource()
      .findState()
      .then((response) => {
        const options = response.data.map((result: any) => ({
          value: result,
          columns: [result.name],
        }));

        this.setOptions(options);
      })
      .catch(() => {});
  }
}
