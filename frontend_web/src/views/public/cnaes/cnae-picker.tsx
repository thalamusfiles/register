import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { IamPicker } from '../../../components/Form/iam-picker';
import { BRCNAEList, TypeKeyValueDataSource } from '../../../datasources/typekeyvalue';

declare type CnaeProps = {
  name: string;
  value?: string;
  description?: string;
  onSel: (value: any | null, row: any, event: any) => void;
  isValid?: boolean;
  isInvalid?: boolean;
  multi?: boolean;
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
        <Form.Control
          autoComplete="off"
          as="select"
          name={this.props.name}
          value={this.props.value}
          onMouseDown={() => this.pickerRef.show()}
          isValid={this.props.isValid}
          isInvalid={this.props.isInvalid}
        >
          <option>{option}</option>
        </Form.Control>
        <Picker
          onSel={this.props.onSel}
          title={'Selecione o CNAE'}
          header={['CNAE', 'Descrição']}
          ref={(ref) => (this.pickerRef = ref)}
          multi={this.props.multi}
        />
      </>
    );
  }
}

class Picker extends IamPicker {
  lastSearch?: string;

  search = () => {
    if (this.lastSearch !== this.state.search) {
      this.setOptions([]);

      new TypeKeyValueDataSource()
        .findBRCNAES(this.state.search)
        .then((response) => {
          const businessTypes = response?.data as BRCNAEList;
          const options = businessTypes.map((result: any) => ({
            value: result,
            columns: [result.key, result.value?.description],
          }));

          this.setOptions(options);
        })
        .catch(() => {});
    }
    this.lastSearch = this.state.search;

    this.ihaaaa();
  };

  ihaaaa = () => {
    this.setOptions(
      [
        {
          hashId: '-4103758526328319390',
          key: '210104',
          value: {
            description: 'Cultivo de teca',
          },
        },
        {
          hashId: '-1426634547115779281',
          key: '210105',
          value: {
            description: 'Cultivo de espécies madeireiras, exceto eucalipto, acácia-negra, pinus e teca',
          },
        },
        {
          hashId: '3599487637623544970',
          key: '1321900',
          value: {
            description: 'Tecelagem de fios de algodão',
          },
        },
        {
          hashId: '1966628113164465264',
          key: '1322700',
          value: {
            description: 'Tecelagem de fios de fibras têxteis naturais, exceto algodão',
          },
        },
        {
          hashId: '-919460337103060015',
          key: '1323500',
          value: {
            description: 'Tecelagem de fios de fibras artificiais e sintéticas',
          },
        },
        {
          hashId: '-4309683706955429426',
          key: '1330800',
          value: {
            description: 'Fabricação de tecidos de malha',
          },
        },
        {
          hashId: '-7194736188400655311',
          key: '1340501',
          value: {
            description: 'Estamparia e texturização em fios, tecidos, artefatos têxteis e peças do vestuário',
          },
        },
        {
          hashId: '8940009819041105155',
          key: '1340502',
          value: {
            description: 'Alvejamento, tingimento e torção em fios, tecidos, artefatos têxteis e peças do vestuário',
          },
        },
        {
          hashId: '-7040667566891210699',
          key: '1340599',
          value: {
            description: 'Outros serviços de acabamento em fios, tecidos, artefatos têxteis e peças do vestuário',
          },
        },
        {
          hashId: '3691821179280520733',
          key: '1354500',
          value: {
            description: 'Fabricação de tecidos especiais, inclusive artefatos',
          },
        },
        {
          hashId: '-7140616414557823647',
          key: '3250708',
          value: {
            description: 'Fabricação de artefatos de tecido não tecido para uso odonto-médico-hospitalar',
          },
        },
        {
          hashId: '-3373202312957953312',
          key: '4222701',
          value: {
            description: 'Construção de redes de abastecimento de água, coleta de esgoto e construções correlatas, exceto obras de irrigação',
          },
        },
        {
          hashId: '-6382857699013049546',
          key: '4641901',
          value: {
            description: 'Comércio atacadista de tecidos',
          },
        },
        {
          hashId: '5934619937384293610',
          key: '4755501',
          value: {
            description: 'Comércio varejista de tecidos',
          },
        },
        {
          hashId: '5502180899153209847',
          key: '6204000',
          value: {
            description: 'Consultoria em tecnologia da informação',
          },
        },
        {
          hashId: '4625060797657240842',
          key: '6209100',
          value: {
            description: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação',
          },
        },
        {
          hashId: '-1298779252672784931',
          key: '6435203',
          value: {
            description: 'Companhias hipotecárias',
          },
        },
        {
          hashId: '-6158103767397146372',
          key: '8542200',
          value: {
            description: 'Educação profissional de nível tecnológico',
          },
        },
        {
          hashId: '-8326892183720088835',
          key: '8640214',
          value: {
            description: 'Serviços de bancos de células e tecidos humanos',
          },
        },
        {
          hashId: '-5981965821900076439',
          key: '9329801',
          value: {
            description: 'Discotecas, danceterias, salões de dança e similares',
          },
        },
        {
          hashId: '4468034274582821409',
          key: '9101500',
          value: {
            description: 'Atividades de bibliotecas e arquivos',
          },
        },
      ].map((result: any) => ({
        value: result,
        columns: [result.key, result.value?.description],
      })),
    );
  };
}
