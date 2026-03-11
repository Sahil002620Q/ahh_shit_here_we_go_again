function checkURL(){

    let url = document.getElementById("urlInput").value;
    let score = 0;

    if(url.includes("@"))
        score++;

    if(url.length > 50)
        score++;

    if((url.match(/\./g) || []).length > 3)
        score++;

    if(url.includes("login") || url.includes("verify") || url.includes("bank"))
        score++;

    let result = document.getElementById("result");

    if(score >= 2)
        result.innerText = "⚠️ This URL looks suspicious.";
    else
        result.innerText = "✅ This URL looks safe.";
}