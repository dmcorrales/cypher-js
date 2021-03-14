var context_alert = document.getElementById("general_alert");
var context_output = document.getElementById("output");
const base_char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const SPANISH_LANG = ['A', 'E', 'O', 'S']
const MODULAR_VALUE = 27
function decrypt(e){
    e.preventDefault()
    var chipper_text = document.getElementById("text_decrypt").value
    if(chipper_text !== ""){
        clear_element(context_alert, {"attr": ["class"]})
        words = chipper_text.replace(/\s/g, '')
        let repeated_words = frequency_words(words)
        context_output.innerHTML = get_top_formula_values(build_top_keys(repeated_words), words)
    }else{
        build_alert(context_alert ,"Oops! Input text cannot bet empty.")
    }
}

function get_top_formula_values(top_values, words){
    return get_values_by_top(top_values[0], top_values[1], words)
}

function get_values_by_top(first, second, words){
    let b = second % MODULAR_VALUE
    let a = ( first - b ) *  modInverse( base_char.indexOf(SPANISH_LANG[1]) , MODULAR_VALUE ) % MODULAR_VALUE 
    let mi_a =  modInverse( a , MODULAR_VALUE ) 
    if(mi_a < 0 || mi_a === undefined || mi_a === NaN){
        get_values_by_top(second, first, words)
        return
    }
    let real_list_decipher = " "
    for(index in words){
        let c = base_char.indexOf(words[index])
        let real_index_decipher =  formula_decipher_text(c , a, b, MODULAR_VALUE)
        if(real_index_decipher < 0){
            real_index_decipher = real_index_decipher * -1 
        }
        real_list_decipher = real_list_decipher + `${base_char[real_index_decipher]}`
    }
    return real_list_decipher
}

function formula_decipher_text(c, a, b, n){
    return ( c - b) * modInverse(a, n) % n
}

function modInverse(a, m) {
    // validate inputs
    [a, m] = [Number(a), Number(m)]
    if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN // invalid input
    }
    a = (a % m + m) % m
    if (!a || m < 2) {
    return NaN // invalid input
    }
    // find the gcd
    const s = []
    let b = m
    while(b) {
    [a, b] = [b, a % b]
    s.push({a, b})
    }
    if (a !== 1) {
    return NaN // inverse does not exists
    }
    // find the inverse
    let x = 1
    let y = 0
    for(let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
    }
    return (y % m + m) % m
}

function frequency_words(words=""){
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

function build_top_values(repeated_words, top=2){
    return [...repeated_words].sort((a,b) => b-a).slice(0,top)
}

function build_top_keys(repeated_words){
    let top_values = build_top_values(repeated_words, 2)
    result = []
    for(value in top_values){
        result.push(repeated_words.indexOf(top_values[value]))
    }
    return result
}

function build_alert(node_elem ,msg="", type="danger"){
    node_elem.setAttribute("class", `alert alert-${type}`)
    node_elem.innerText=(msg)
}


function clear_element(node_elem, jobs){
    jobs_attr = jobs["attr"]
    for(i in jobs_attr){
        node_elem.removeAttribute(jobs_attr[i])
    }
    node_elem.innerText=""
}