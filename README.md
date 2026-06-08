margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Georgia", serif;
}

body{
    background: #0f0f0f;
    color: #fff;
}

.container{
    max-width: 1200px;
    margin: auto;
    padding: 40px;
}

.card{
    background: linear-gradient(145deg, #1b1b1b, #2c1e12);
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    transition: 0.4s;
}

.card:hover{
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(212,175,55,0.3);
}

h1{
    color: #d4af37;
    text-align: center;
    font-size: 3rem;
    margin-bottom: 20px;
    text-shadow: 0 0 15px rgba(212,175,55,0.5);
}

h2{
    color: #e6c76b;
    margin-bottom: 15px;
}

p{
    color: #ddd;
    line-height: 1.8;
}

button{
    background: linear-gradient(45deg, #d4af37, #f5d76e);
    color: #111;
    border: none;
    padding: 14px 30px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.4s;
}

button:hover{
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(212,175,55,0.7);
}

img{
    width: 100%;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.5);
}

header{
    background: rgba(20,20,20,0.95);
    padding: 20px;
    border-bottom: 2px solid #d4af37;
}

nav a{
    color: #d4af37;
    text-decoration: none;
    margin: 0 15px;
    font-weight: bold;
}

nav a:hover{
    color: #fff;
}
