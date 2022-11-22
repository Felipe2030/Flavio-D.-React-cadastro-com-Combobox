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

  async function novo(){
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
      
      api.get(`/Movimento`).then((res) => {
        setListMovimento(res.data);
      });
    });
  }

  return (
    <div className="container">
      <div className="containerInputs">
        <h2>Movimento</h2><br/>

        <label>Mês:
          <input maxlength="2" type="text" placeholder="Digite um mes" value={mes} onChange={(e) => setMes(e.target.value)}  required/>
        </label>

        <label>Ano:
          <input maxlength="4" type="text" placeholder="Digite um ano" value={ano} onChange={(e) => setAno(e.target.value)} required/>
        </label>

        <label>Produto:
          <select value={produto} onChange={(e) => {
            setProduto(e.target.value)
            getCosif(e.target.value)
          }} required>
            <option>---</option>
            {listProduto.map(function(produto, i){
                return <option key={i} value={produto.codProduto}>{produto.desProduto}</option>;
            })}
          </select>
        </label>

        <label>Cosif:
          <select value={cosif} onChange={(e) => setCosif(e.target.value)} required>
            <option>---</option>
            {listCosif.map(function(cosif, i){
                return <option key={i} value={cosif.codCosif}>{cosif.codClassificacao}</option>;
            })}
          </select>
        </label>

        <label>Valor:
          <input type="text" placeholder="Digite um valor" value={valor} onChange={(e) => setValor(e.target.value)} required/>
        </label>

        <label>Descrição:
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required>
          </textarea>
        </label>
        
        <div className='containerButtons'>
          <button className="buttonSubmit" onClick={limpar}>Limpar</button>
          <button className="buttonSubmit" onClick={novo}>Novo</button>
          <button className="buttonSubmit">Incluir</button>
        </div>
      </div>

      <main className='main'>
        <h2>Lista</h2><br/>

        <table>
          <thead>
            <tr>
              <td>Mês</td>
              <td>Ano</td>
              <td>Coóigo do Produto</td>
              <td>Descrição do Produto</td>
              <td>NR Lançamento</td>
              <td>Descrição</td>
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
            <span>Sem conteúdo !</span>
        )}
      </main>
    </div>
  );
}

export default App;
