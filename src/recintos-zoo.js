export class RecintosZoo {
    constructor() {
      // Definição dos recintos e animais
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: { 'MACACO': 3 } },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: {} },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: { 'GAZELA': 1 } },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: {} },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: { 'LEAO': 1 } }
      ];
  
      this.animais = {
        'LEAO': { tamanho: 3, bioma: 'savana' },
        'LEOPARDO': { tamanho: 2, bioma: 'savana' },
        'CROCODILO': { tamanho: 3, bioma: 'rio' },
        'MACACO': { tamanho: 1, bioma: 'savana ou floresta' },
        'GAZELA': { tamanho: 2, bioma: 'savana' },
        'HIPOPOTAMO': { tamanho: 4, bioma: 'savana ou rio' }
      };
    }
  
    analisaRecintos(especie, quantidade) {
      if (!this.animais[especie]) {
        return { erro: "Animal inválido" };
      }
  
      if (typeof quantidade !== 'number' || quantidade <= 0) {
        return { erro: "Quantidade inválida" };
      }
  
      let recintosViaveis = [];
  
      this.recintos.forEach(recinto => {
        const { bioma, tamanhoTotal, animais } = recinto;
        const espacoOcupado = this.calculaEspacoOcupado(animais);
  
        if (this.podeAdicionarAnimal(bioma, especie, quantidade, animais, tamanhoTotal - espacoOcupado)) {
          let espaçoOcupado = espacoOcupado + (this.animais[especie].tamanho * quantidade);
          let espaçoLivre = tamanhoTotal - espaçoOcupado;
          recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espaçoLivre} total: ${tamanhoTotal})`);
        }
      });
  
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      } else {
        return { recintosViaveis: recintosViaveis.sort((a, b) => a.localeCompare(b)) };
      }
    }
  
    podeAdicionarAnimal(bioma, especie, quantidade, animais, espaçoLivre) {
      const animal = this.animais[especie];
      if (!animal) return false;
  
      // Verifica se o bioma é adequado
      if (!this.biomaAdequado(bioma, animal.bioma)) {
        return false;
      }
  
      // Verifica se há espaço suficiente
      const espaçoOcupado = this.calculaEspacoOcupado(animais) + (animal.tamanho * quantidade);
      if (espaçoOcupado > espaçoLivre) {
        return false;
      }
  
      // Regras específicas
      if (this.ehCarnivoro(especie) && this.temOutrosAnimais(animais, especie)) {
        return false;
      }
  
      if (especie === 'MACACO' && quantidade > 1 && !this.temOutrosAnimais(animais, especie)) {
        return false;
      }
  
      if (animal.bioma === 'savana ou rio' && !bioma.includes('savana e rio')) {
        return false;
      }
  
      // Verifica se o recinto está adaptado às regras de várias espécies
      if (Object.keys(animais).length > 0 && quantidade > 1) {
        if (Object.keys(animais).length > 1 || (this.ehCarnivoro(especie) && !this.ehCarnivoro(Object.keys(animais)[0]))) {
          if (espaçoLivre < (animal.tamanho * quantidade) + 1) {
            return false;
          }
        }
      }
  
      return true;
    }
  
    calculaEspacoOcupado(animais) {
      let espaçoOcupado = 0;
      for (const especie in animais) {
        espaçoOcupado += this.animais[especie].tamanho * animais[especie];
      }
      return espaçoOcupado;
    }
  
    biomaAdequado(bioma, biomaAnimal) {
      return bioma.includes(biomaAnimal) || biomaAnimal === 'savana ou floresta' && bioma.includes('floresta') || biomaAnimal === 'savana ou rio' && bioma.includes('savana e rio');
    }
  
    ehCarnivoro(especie) {
      return ['LEAO', 'LEOPARDO'].includes(especie);
    }
  
    temOutrosAnimais(animais, especie) {
      return Object.keys(animais).some(outro => outro !== especie);
    }
  }
  