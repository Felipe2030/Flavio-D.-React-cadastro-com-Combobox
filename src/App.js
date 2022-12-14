import { useState, useEffect } from 'react';
import api from './services/api'
import "./styles.css"

function App() {
  const [mes, setMes]             = useState("");
  const [ano, setAno]             = useState("");
  const [produto, setProduto]     = useState("");
  const [cosif, setCosif]         = useState("");
  const [listMovimento, setListMovimento] = useState([]);
  const [listProduto, setListProduto] = useState([]);
  const [listCosif, setListCosif] = useState([]);
  const [valor, setValor]         = useState("");
  const [descricao, setDescricao] = useState("");
  const [bloqueio, setBloqueio] = useState(true);

  useEffect(() => {
      api.get(`/Produto`).then((res) => {
        setListProduto(res.data);
      });

      api.get(`/Movimento`).then((res) => {
        setListMovimento(res.data);
      });
  }, []);

  function getCosif(valueProduto){
    api.get(`/Cosif`).then((res) => {
      const listagem = res.data;
      setListCosif(listagem.map((cosif) => {
        return (cosif.codProduto == valueProduto) ? cosif : false;
      }).filter((cosif) => (cosif)));
    });
  }

  async function limpar(){
    setMes("");
    setAno("");
    setValor("");
    setDescricao("");
    setCosif("");
    setProduto("");
  }

  async function incluir(){
    if(!bloqueio){
      let lancamento = 1;
      let codUsuario = "AMD";
  
      if(!!!mes || !!!ano || !!!valor || !!!descricao || !!!cosif || !!!produto){
        alert("Preencha todos os campos!");
        return;
      }
      
      api.post(`/Movimento`,{
          "mes": mes,
          "ano": ano, 
          "lancamento": parseInt(lancamento), 
          "codProduto": produto,
          "codCosif": cosif,
          "descricao": descricao,
          "codUsuario": codUsuario,
          "valor": parseFloat(valor)
        }).then((res) => {
          limpar();
          setBloqueio(true);
          api.get(`/Movimento`).then((res) => {
            setListMovimento(res.data);
          });
        });
      }
  }

  async function novo(){
    setBloqueio(false);
  }

  return (
    <div className="container">
      <div className="containerInputs">
        <h2>Movimento</h2><br/>

        <label>M??s:
          <input type="text" placeholder="Digite um mes" value={mes} onChange={(e) => setMes(e.target.value)}  required disabled={bloqueio}/>
        </label>

        <label>Ano:
          <input type="text" placeholder="Digite um ano" value={ano} onChange={(e) => setAno(e.target.value)} required disabled={bloqueio}/>
        </label>

        <label>Produto:
          <select value={produto} onChange={(e) => {
            setProduto(e.target.value)
            getCosif(e.target.value)
          }} required disabled={bloqueio}>
            <option>---</option>
            {listProduto.map(function(produto, i){
                return <option key={i} value={produto.codProduto}>{produto.desProduto}</option>;
            })}
          </select>
        </label>

        <label>Cosif:
          <select value={cosif} onChange={(e) => setCosif(e.target.value)} required disabled={bloqueio}>
            <option>---</option>
            {listCosif.map(function(cosif, i){
                return <option key={i} value={cosif.codCosif}>{cosif.codCosif} - {cosif.codClassificacao}</option>;
            })}
          </select>
        </label>

        <label>Valor:
          <input type="text" placeholder="Digite um valor" value={valor} onChange={(e) => setValor(e.target.value)} required disabled={bloqueio}/>
        </label>

        <label>Descri????o:
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required disabled={bloqueio}>
          </textarea>
        </label>
        
        <div className='containerButtons'>
          <button className="buttonSubmit" onClick={limpar}>Limpar</button>
          <button className="buttonSubmit" onClick={novo}>Novo</button>
          <button className="buttonSubmit" onClick={incluir}>Incluir</button>
        </div>
      </div>

      <main className='main'>
        <h2>Lista</h2><br/>

        <table>
          <thead>
            <tr>
              <td>M??s</td>
              <td>Ano</td>
              <td>Co??igo do Produto</td>
              <td>Descri????o do Produto</td>
              <td>NR Lan??amento</td>
              <td>Descri????o</td>
              <td>Valor</td>
            </tr>
          </thead>
          <tbody>
          {listMovimento.map(function(movimeto, i){
            return (
              <tr key={i}>
                <td>{movimeto.mes}</td>
                <td>{movimeto.ano}</td>
                <td>{movimeto.codProduto}</td>
                <td>{listProduto.map((produto) => (produto.codProduto == movimeto.codProduto) ? produto.desProduto : false).filter((produto) => (produto))[0]}</td>
                <td>{movimeto.lancamento}</td>
                <td>{movimeto.descricao}</td>
                <td>R$ {movimeto.valor}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
        {Object.keys(listMovimento).length == 0 && (
            <span>Sem conte??do !</span>
        )}
      </main>
    </div>
  );
}

export default App;
