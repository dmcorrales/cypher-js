var context_alert = document.getElementById("general_alert")
var context_output = document.getElementById("output")
const base_char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const SPANISH_LANG = ['A', 'E', 'O', 'S']
const MODULAR_VALUE = 27

function decrypt(e){
    e.preventDefault()
    var chipper_text = document.getElementById("text_decrypt").value
    if(chipper_text !== ""){
        clearElement(context_alert, {"attr": ["class"]})
        var words = chipper_text.replace(/\s/g, '')
        var repeated_words = frequencyWords(words)
        context_output.innerHTML = getTopFormulaValues(buildTopKeys(repeated_words), words)
    }else{
        buildAlert(context_alert, "Oops! Input text cannot bet empty.")
    }
}

function encrypt(e){
    e.preventDefault()
    var chipper_text = document.getElementById("text_encrypt").value
    if(chipper_text !== ""){
        clearElement(context_alert, {"attr": ["class"]})
        var words = chipper_text.replace(/\s/g, '')
        var repeated_words = frequencyWords(words)
        var a = document.getElementById("a_encrypt").value
        var b = document.getElementById("b_encrypt").value
        var chipper_text = document.getElementById("text_encrypt").value
        context_output.innerHTML = getEncryptedValues(words, a, b)
    }else{
        buildAlert(context_alert, "Oops! Input text cannot bet empty.")
    }
}

function getEncryptedValues(words, a, b){
    if(modInverse(a, b) === NaN){
        buildAlert(context_alert, `modInverse for ${a}/${MODULAR_VALUE} is not valid`)
        return 
    }
    let real_list_cipher = " "
    for(index in words){
        m = base_char.indexOf(words[index].toUpperCase())
        real_index_cipher = formulaCipherText(a, m, b, MODULAR_VALUE)
        real_list_cipher = real_list_cipher + `${base_char[real_index_cipher]}`
    }
    return real_list_cipher
}

function getTopFormulaValues(top_values, words){
    return getValuesByTop(top_values[0], top_values[1], words)
}

function getValuesByTop(first, second, words){
    let b = second % MODULAR_VALUE
    let a = ( first - b ) *  modInverse( base_char.indexOf(SPANISH_LANG[1]) , MODULAR_VALUE ) % MODULAR_VALUE 
    let mi_a =  modInverse( a , MODULAR_VALUE ) 
    if(mi_a < 0 || mi_a === undefined || mi_a === NaN){
        getValuesByTop(second, first, words)
        return
    }
    let real_list_decipher = " "
    for(index in words){
        let c = base_char.indexOf(words[index])
        let real_index_decipher =  formulaDecipherText(c , a, b, MODULAR_VALUE)
        if(real_index_decipher < 0){
            real_index_decipher = real_index_decipher * -1 
        }
        real_list_decipher = real_list_decipher + `${base_char[real_index_decipher]}`
    }
    return real_list_decipher
}

function formulaDecipherText(c, a, b, n){
    return ( c - b) * modInverse(a, n) % n
}

function formulaCipherText(a, m, b, n){
    return ( a * m + b ) % n
}

function frequencyWords(words=""){
    var repeated_words = []
    for(word_phase_1 in base_char){
        let counter = 0
        for(word_phase_2 in words){
            if(base_char[word_phase_1] === words[word_phase_2].toUpperCase()){
                counter ++
            }
        }
        repeated_words.push(counter)
    }
    return repeated_words
}

function buildTopValues(repeated_words, top=2){
    return [...repeated_words].sort((a,b) => b-a).slice(0,top)
}

function buildTopKeys(repeated_words){
    let top_values = buildTopValues(repeated_words, 2)
    result = []
    for(value in top_values){
        result.push(repeated_words.indexOf(top_values[value]))
    }
    return result
}

function modInverse(a, m) {
    [a, m] = [Number(a), Number(m)]
    if (Number.isNaN(a) || Number.isNaN(m)) {
        return NaN 
    }
    a = (a % m + m) % m
    if (!a || m < 2) {
        return NaN
    }
    const s = []
    let b = m
    while(b) {
        [a, b] = [b, a % b]
        s.push({a, b})
    }
    if (a !== 1) {
        return NaN
    }
    let x = 1
    let y = 0
    for(let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
    }
    return (y % m + m) % m
}

/**
 * Utility DOM functions (alerts and elements)
 */
function buildAlert(node_elem ,msg="", type="danger"){
    node_elem.setAttribute("class", `alert alert-${type}`)
    node_elem.innerText=(msg)
}


function clearElement(node_elem, jobs){
    jobs_attr = jobs["attr"]
    for(i in jobs_attr){
        node_elem.removeAttribute(jobs_attr[i])
    }
    node_elem.innerText=""
}