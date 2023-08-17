import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { IamPicker } from '../../../components/Form/iam-picker';
import { BRCNAEList, TypeKeyValueDataSource } from '../../../datasources/typekeyvalue';

declare type CnaeProps = {
  name: string;
  value?: string;
  description?: string;
  onSel: (value: any | null, row: any, event: any) => void;
};

export class CnaePickerPlugin extends Component<CnaeProps> {
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
        <Picker onSel={this.props.onSel} title={'Selecione o Estado'} header={['CNAE', 'Descrição']} ref={(ref) => (this.pickerRef = ref)} />
      </>
    );
  }
}

class Picker extends IamPicker {
  stateCode: any;

  search = () => {
    this.setOptions([]);

    new TypeKeyValueDataSource()
      .findBRCNAES()
      .then((response) => {
        const businessTypes = response.data as BRCNAEList;
        const options = businessTypes.map((result: any) => ({
          value: result,
          columns: [result.key, result.value?.description],
        }));

        this.setOptions(options);
      })
      .catch(() => {});
  };
}
