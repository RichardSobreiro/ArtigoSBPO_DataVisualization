import React, { Component } from 'react';
import './App.css';
import Chart from 'react-google-charts'

class App extends Component {
  state = {
    graficos: []
  }

  buscarTimeline(){
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin':'*',
      }
    };
    fetch("https://localhost:44338/api/Result", requestOptions)
      .then(res => res.json())
      .then(
        (result) => this.atualizarDados(result),
        (error) => {
          this.setState({
            graficos: [],
            error
          });
        }
      )
  }

  atualizarDados(result){
    const graficos = result.map(betoneira => {
      var viagensDados = betoneira.viagens.map(
        (viagem) => 
        [
          viagem.viagemId, 
          viagem.clienteDescricao,
          new Date(viagem.inicio),
          new Date(viagem.fim),
          "<h2> Anything can go here </h2>" /*+ viagem.atrasoPesagem,
          'Avanco pesagem: ' + viagem.avancoPesagem,
          'Atraso cliente: ' + viagem.atrasoChegadaCliente,
          'Avanco pesagem: ' + viagem.avancoChegadaCliente*/
        ]);
      
      viagensDados.unshift([
        { type: 'string', id: 'Betoneira' },
        { type: 'string', id: 'Cliente' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' },
        { role: "tooltip", type: "string", 'p': {'html': true} }
      ]);
      return <div>
              <h5>Betoneira {betoneira.betoneira}</h5>
              <h5>Ponto Carga {betoneira.pontoCargaId}</h5>
              <Chart
                key={betoneira.betoneira}
                width={'100%'}
                height={'200px'}
                chartType="Timeline"
                loader={<div>Loading Chart</div>}
                data={
                  viagensDados
                }
                options={
                  {
                    timeline: { showRowLabels: false },
                    avoidOverlappingGridLines: false,
                    legend: { position: 'none' },
                    tooltip: { isHtml: true }
                  }
                }
                rootProps={{ 'data-testid': '9' }}
              />
              </div>;
    });

    this.setState({
      graficos: graficos
    })
  }

  render() {
  return (
    <div>
      <div>
        <button onClick={() => this.buscarTimeline()}>Buscar</button>
      </div>
      <div>
          {this.state.graficos}
      </div>
    </div>
  )
  }
}

export default App;
