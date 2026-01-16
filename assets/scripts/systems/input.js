// assets/scripts/core/input.js
export const InputWrapper = {
    atual: 0, 
    anterior: 0,
    
    update: function(padOriginal) {
        this.anterior = this.atual;
        this.atual = padOriginal.btns;
    },
    
    justPressed: function(botao) {
        return (this.atual & botao) && !(this.anterior & botao);
    }
};