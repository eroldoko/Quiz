let movies = document.querySelector(".movies")
let sport = document.querySelector(".sport")
let history = document.querySelector(".history")
let mainCategory = document.getElementById("mainCategory")
let choice = document.querySelectorAll(".choice")
let startDiv = document.getElementsByClassName("start")[0]

//event listener for category choice
choice.forEach(
        function (el) {
                el.addEventListener('click', start)
        }
);
//array for event listeners
let arrayFunc = []

//removing event listeners
rmEventListeners = function () {
        for (i = 0; i < arrayFunc.length; i++) {
                view.start.removeEventListener('click', arrayFunc[i]);
        }
}
checkResponse = function (event) {
        game.check(event)
};
//adjusting the opacity of category tabs
function opacityInd(zInd) {
        choice.forEach(
                function (el) {
                        el.style.zIndex = zInd
                }
        );
}
//game start logic,based on chosen category
function start(event) {
        view.start.textContent = "Start"
        if (event.target.textContent == "movies") {
                mainCategory.classList.toggle("movies")
                mainCategory.classList.remove('sport', 'history')
                mainCategory.style.display = "block"
                mainCategory.textContent = "movies"
                opacityInd("-1")

                if (!localStorage.highScoreMovies) {
                        view.hiScore.textContent = "Not Set Yet"
                } else {
                        view.hiScore.textContent = localStorage.highScoreMovies;
                }
                view.timer.textContent = "30";
                view.score.textContent = "0";
                view.result.textContent = "";
                view.info.textContent = "";

                const url = 'https://raw.githubusercontent.com/eroldoko/Quiz/master/questions/questions1.json';
                fetch(url)
                        .then(res => res.json())
                        .then(quiz => {
                                startQuiz1 = function () {
                                        view.start.removeEventListener('click', startQuiz1);
                                        view.response.addEventListener('click', checkResponse, false);
                                        game.start(quiz.questions)
                                        opacityInd("-1")
                                        mainCategory.style.display = "block"
                                }
                                arrayFunc.push(startQuiz1)
                                rmEventListeners()
                                view.start.addEventListener('click', startQuiz1, false);
                        });
        } else if (event.target.textContent == "sport") {

                if (!localStorage.highScoreSport) {
                        view.hiScore.textContent = "Not Set Yet"
                } else {
                        view.hiScore.textContent = localStorage.highScoreSport;
                }
                opacityInd("-1")
                mainCategory.classList.toggle("sport")
                mainCategory.classList.remove('movies', 'history')
                mainCategory.style.display = "block"
                mainCategory.textContent = "sport"

                view.timer.textContent = "30";
                view.score.textContent = "0";
                view.result.textContent = "";
                view.info.textContent = "";
                view.start.textContent = "Start"

                const url = 'https://raw.githubusercontent.com/eroldoko/Quiz/master/questions/questions2.json';
                fetch(url)
                        .then(res => res.json())
                        .then(quiz => {
                                startQuiz2 = function () {
                                        view.start.removeEventListener('click', startQuiz2);
                                        view.response.addEventListener('click', checkResponse, false);
                                        game.start(quiz.questions)
                                        opacityInd("-1")
                                        mainCategory.style.display = "block"
                                }
                                arrayFunc.push(startQuiz2)
                                rmEventListeners()
                                view.start.addEventListener('click', startQuiz2, false);
                        });
        } else if (event.target.textContent == "history") {
               
                mainCategory.classList.toggle("history")
                mainCategory.classList.remove('movies', 'sport')
                mainCategory.style.display = "block"
                mainCategory.textContent = "history"
                opacityInd("-1")

                if (!localStorage.highScoreHistory) {
                        view.hiScore.textContent = "Not Set Yet"
                } else {
                        view.hiScore.textContent = localStorage.highScoreHistory;
                }
                view.timer.textContent = "30";
                view.score.textContent = "0";
                view.result.textContent = "";
                view.info.textContent = "";
                
                const url = 'https://raw.githubusercontent.com/eroldoko/Quiz/master/questions/questions3.json';
                fetch(url)
                        .then(res => res.json())
                        .then(quiz => {
                                startQuiz3 = function () {
                                        view.start.removeEventListener('click', startQuiz3);
                                        view.response.addEventListener('click', checkResponse, false);
                                        game.start(quiz.questions)
                                        opacityInd("-1")
                                        mainCategory.style.display = "block"
                                }
                                arrayFunc.push(startQuiz3)
                                rmEventListeners()
                                view.start.addEventListener('click', startQuiz3, false);
                        });
        }
        choice.forEach(
                function (el) {
                        el.removeEventListener("click", start);
                }
        );
        startDiv.style.display = "block"
}
//shuffling questions
function shuffle(array) {
        for (let i = array.length; i > 0; i--) {
                let j = Math.floor(Math.random() * i);
                [array[i - 1], array[j]] = [array[j], array[i - 1]];
        }
}
// View Object
const view = {
        score: document.querySelector('#score strong'),
        question: document.getElementById('question'),
        result: document.getElementById('result'),
        start: document.getElementById('start'),
        response: document.querySelector('.response'),
        timer: document.querySelector('#timer strong'),
        hiScore: document.querySelector('#hiScore strong'),

        show(element) {
                element.style.display = 'block';
        },
        hide(element) {
                element.style.display = 'none';
        },
        info: document.getElementById('info'),

        render(target, content, attributes) {
                for (const key in attributes) {
                        target.setAttribute(key, attributes[key]);
                }
                target.innerHTML = content;
        },
        setup() {
                this.show(this.question);
                this.show(this.response);
                this.show(this.result);
                this.hide(this.start);

                this.render(this.score, game.score);
                this.render(this.result, '');
                this.render(this.info, '');
                this.render(this.hiScore, game.hiScore());
        },
        teardown() {
                this.hide(this.question);
                this.hide(this.response);
                this.show(this.start);
                this.show(this.result);
                this.render(this.hiScore, game.hiScore());
        },
        buttons(array) {
                return array.map(value => `<div class = "answer">${value}</div>`).join('');
        }
};
//Game object
const game = {
        start(quiz) {
                choice.forEach(
                        function (el) {
                                el.removeEventListener('click', start)
                        }
                );
                this.questions = [...quiz];
                this.questionsLength = this.questions.length;
                this.score = 0;
                view.setup();
                this.ask();
                this.secondsRemaining = 30;
                view.render(view.timer, game.secondsRemaining);
                this.timer = setInterval(this.countdown, 1000);
        },
        ask() {
                if (mainCategory.textContent == "sport") {
                        shuffle(this.questions);
                        this.question = this.questions.pop();
                        const options2 = [this.question.answer[0], this.question.answer[1], this.question.answer[2], this.question.correct];
                        shuffle(options2);
                        const question = `${this.question.question}?`;
                        view.render(view.question, question);
                        view.render(view.response, view.buttons(options2))
                } else if (mainCategory.textContent == "movies") {
                        shuffle(this.questions);
                        this.question = this.questions.pop();
                        const options1 = [this.questions[0].realName, this.questions[1].realName, this.questions[2].realName, this.question.realName];
                        shuffle(options1);
                        const question = `Who played ${this.question.name} in ${this.question.movie}?`;
                        view.render(view.question, question);
                        view.render(view.response, view.buttons(options1))
                }else if (mainCategory.textContent == "history") {
                        shuffle(this.questions);
                        this.question = this.questions.pop();
                        const options3 = [this.question.answer[0], this.question.answer[1], this.question.answer[2], this.question.correct];
                        shuffle(options3);
                        const question = `${this.question.question}?`;
                        view.render(view.question, question);
                        view.render(view.response, view.buttons(options3))
                }
        },
        check(event) {
                const answerDiv = document.querySelectorAll('.answer')
                const response = event.target.textContent;
                const answer = this.question.realName;

                if (response === answer) {
                        event.target.classList.add('correct')
                        this.score++;
                        view.render(view.score, this.score);
                } else {
                        event.target.style.background = "red"
                        for (let i = 0; i < answerDiv.length; i++) {
                                const element = answerDiv[i];
                                if (element.textContent === answer) {

                                        element.style.background = "green"
                                        element.style.opacity = "0.8"
                                        element.classList.add('blinkGreen')
                                }
                        }
                }
                askNext = function () {
                        game.ask()
                };
                setTimeout(askNext, 2000)

                const correctAnswer = this.question.correct;
                if (correctAnswer) {
                   if (response === correctAnswer) {
                    event.target.classList.add("correct");
                    this.score++;
                    view.render(view.score, this.score);
                } else {
                   event.target.style.background = "red";
                    for (let i = 0; i < answerDiv.length; i++) {
                        const element = answerDiv[i];
                        if (element.textContent === correctAnswer) {
                            element.style.background = "green";
                            element.style.opacity = "0.8";
                            element.classList.add("blinkGreen");
                        }
                    }
                }
            }
        },
        countdown() {
                game.secondsRemaining--;
                view.render(view.timer, game.secondsRemaining);
                if (game.secondsRemaining == 0) {
                        game.gameOver();
                }
        },
        gameOver() {
                opacityInd("1")
                mainCategory.style.display = "none"
                view.render(view.info, `Game Over, you scored ${this.score} point${this.score !== 1 ? 's' : ''}`);
                view.teardown();
                clearInterval(this.timer);

                view.response.removeEventListener('click', checkResponse, false);

                if (mainCategory.textContent == "movies") {

                        view.start.textContent = "Start Over or choose other Category"
                        view.start.addEventListener('click', startQuiz1, false);
                } else if (mainCategory.textContent == "sport") {

                        view.start.textContent = "Start Over or choose other Category"
                        view.start.addEventListener('click', startQuiz2, false);

                } else if (mainCategory.textContent == "history") {
                        view.start.textContent = "Start Over or choose other Category"
                        view.start.addEventListener('click', startQuiz3, false);
                }
                choice.forEach(
                        function (el) {
                                el.addEventListener('click', start)
                        }
                );
        },
        hiScore() {
                if (mainCategory.textContent == "movies") {
                        if (!localStorage.highScoreMovies) {
                                const highMovies = 0;
                                localStorage.highScoreMovies = highMovies
                        } else {
                                const highMovies = localStorage.highScoreMovies
                                if (this.score > highMovies) {
                                        localStorage.setItem('highScoreMovies', this.score);
                                        view.render(view.info, '** NEW HIGH SCORE! **');
                                }
                        }
                        return localStorage.getItem('highScoreMovies');
                } else if (mainCategory.textContent == "sport") {

                        if (!localStorage.highScoreSport) {
                                const highSport = 0;
                                localStorage.highScoreSport = highSport
                        } else {
                                const highSport = localStorage.highScoreSport
                                if (this.score > highSport) {
                                        localStorage.setItem('highScoreSport', this.score);
                                        view.render(view.info, '** NEW HIGH SCORE! **');
                                }
                        }
                        return localStorage.getItem('highScoreSport');
                } else if (mainCategory.textContent == "history") {

                        if (!localStorage.highScoreHistory) {
                                const highHistory = 0;
                                localStorage.highScoreHistory = highHistory
                        } else {
                                const highHistory = localStorage.highScoreHistory
                                if (this.score > highHistory) {
                                        localStorage.setItem('highScoreHistory', this.score);
                                        view.render(view.info, '** NEW HIGH SCORE! **');
                                }
                        }
                        return localStorage.getItem('highScoreHistory');
                }
        }
}

