class consultaPrecoEPrazos {
    autoFormatarCep(event) {
        const textarea = event.target;
        const texto = textarea.value;
        const linhas = texto.split("\n");
      
        linhas.forEach((linha, indice) => {
          const cep = linha.trim();
          if (cep.length > 9) {
            linhas[indice] = cep.slice(0, 9);
          } else if (cep.length === 8 && !cep.includes('-')) {
            linhas[indice] = `${cep.slice(0, 5)}-${cep.slice(5)}`;
          }
        });
      
        textarea.value = linhas.join("\n");
    }
  
    removerHifenDoCep(cep) {
      return cep.replace('-', '');
    }
  
    validarCep(cep) {
        const cepSemHifen = this.removerHifenDoCep(cep);
        if (cepSemHifen.length !== 8) {
          throw new Error('CEP inválido');
        }
        return cepSemHifen;
    }
    
  
    formatarResultados(cepOrigem, listaDestino) {
      return listaDestino.map(cepDestino => {
        return {
          cepOrigem,
          cepDestino
        };
      });
    }
  
    async consultar() {
        try {
            const cepOrigem = this.validarCep(this.cepOrigem.value.trim());
            const listaDestino = this.cepDestino.value.split('\n').map(linha => this.validarCep(linha.trim()));
      
            if (listaDestino.length === 0) {
              throw new Error('Lista de destinos vazia');
            }
      
            const resultados = this.formatarResultados(cepOrigem, listaDestino);
            return resultados;
          } catch (erro) {
            this.tratarErro(erro);
          }
    }

    async consultarCep(cepOrigem, cepDestino) {
        // Retorne um objeto com as propriedades cepOrigem e cepDestino, se aceita sedex 10, 12 ou normal
        // Faça a consulta para a API dos Correios aqui
      const resposta = await fetch(``);
      const dados = await resposta.json();

      // Trate a resposta da API dos Correios
      const resultado = {
        cepOrigem,
        cepDestino,
        sedex10: dados.sedex10,
        sedex12: dados.sedex12,
        sedex: dados.sedex
      };
      
      return resultado;
    }
    
    exibirResultados(resultados) {
      const mensagem = resultados.map(resultado => {
        return `CEP Origem: ${resultado.cepOrigem}\nCEP Destino: ${resultado.cepDestino}\nSedex 10: ${resultado.sedex10}\nSedex 12: ${resultado.sedex12}\nSedex: ${resultado.sedex}`;
      }).join('\n\n');
    
      alert(mensagem);
    }
  
    tratarErro(erro) {
      console.error(erro);
      // Implemente a lógica para tratar erros
    }
  
    constructor() {
      this.cepOrigem = document.getElementById("cep-origem");
      this.cepDestino = document.getElementById("ceps-destino");
      this.botaoConsultar = document.getElementById("consultar");

      if (!this.cepOrigem || !this.cepDestino || !this.botaoConsultar) {
        throw new Error('Elementos não encontrados');
      }  
  
      this.cepOrigem.addEventListener("input", this.autoFormatarCep.bind(this));
      this.cepDestino.addEventListener("input", this.autoFormatarCep.bind(this));

    
      this.botaoConsultar.addEventListener("click", async () => {
        const resultados = await this.consultar();
        const resultadosComSedex = await Promise.all(resultados.map(resultado => this.consultarCep(resultado.cepOrigem, resultado.cepDestino)));
        this.exibirResultados(resultadosComSedex);
      });

      // console.log com o arquivo json formatado por questões de teste remover quando pronto
      this.botaoConsultar.addEventListener("click", async () => {
        const resultados = await this.consultar();
        console.log(resultados);
      });
    }
  }
  
  const consulta = new consultaPrecoEPrazos();