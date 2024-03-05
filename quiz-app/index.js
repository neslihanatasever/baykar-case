fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        const firstTenData = data.slice(0, 10);
        const quizData = firstTenData.map(data => ({
            question: data.title,
            options: [data.body, 'London', 'Berlin', 'Madrid'],
            answer: data.body
        }));

        const quizContainer = document.getElementById('quiz');
        const resultContainer = document.getElementById('result');
        const submitButton = document.getElementById('submit');
        const retryButton = document.getElementById('retry');
        const showAnswerButton = document.getElementById('showAnswer');
        const countdownElement = document.getElementById('countdown');

        let currentQuestion = 0;
        let score = 0;
        let incorrectAnswers = [];
        let timeLeft = 30;

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function displayQuestion() {
            const questionData = quizData[currentQuestion];

            const questionElement = document.createElement('div');
            questionElement.className = 'question';
            questionElement.innerHTML = questionData.question;

            const optionsElement = document.createElement('ul');
            optionsElement.className = 'options';

            const shuffledOptions = [...questionData.options];
            shuffleArray(shuffledOptions);

            for (let i = 0; i < shuffledOptions.length; i++) {
                const listItem = document.createElement('li');
                listItem.className = 'option';
            
                const option = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'quiz';
                radio.value = shuffledOptions[i];
            
                const optionText = document.createTextNode(shuffledOptions[i]);
            
                option.appendChild(radio);
                option.appendChild(optionText);
            
                listItem.appendChild(option);
                optionsElement.appendChild(listItem);
            }

            quizContainer.innerHTML = '';
            quizContainer.appendChild(questionElement);
            quizContainer.appendChild(optionsElement);
            
            
            startCountdown();
        }

        function startCountdown() {
            timeLeft = 30;
            const countdownInterval = setInterval(() => {
                countdownElement.textContent = `Time left: ${timeLeft} seconds`;
                timeLeft--;
                if (timeLeft < 0) {
                    clearInterval(countdownInterval);
                    currentQuestion++;
                    if (currentQuestion < quizData.length) {
                        displayQuestion();
                    } else {
                        displayResult();
                    }
                }
            }, 1000);
        }

        function checkAnswer() {
            const selectedOption = document.querySelector('input[name="quiz"]:checked');
            if (selectedOption) {
                this.classList.add("mystyle")
                const answer = selectedOption.value;
                if (answer === quizData[currentQuestion].answer) {
                    score++;
                } else {
                    incorrectAnswers.push({
                        question: quizData[currentQuestion].question,
                        incorrectAnswer: answer,
                        correctAnswer: quizData[currentQuestion].answer,
                    });
                }
                currentQuestion++;
                selectedOption.checked = false;
                if (currentQuestion < quizData.length) {
                    displayQuestion();
                } else {
                    displayResult();
                }
            }
        }

        function displayResult() {
            quizContainer.style.display = 'none';
            submitButton.style.display = 'none';
            retryButton.style.display = 'inline-block';
            showAnswerButton.style.display = 'inline-block';
            resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
            countdownElement.style.display = 'none'; 
        }
        
        function retryQuiz() {
            currentQuestion = 0;
            score = 0;
            incorrectAnswers = [];
            timeLeft = 30;
            quizContainer.style.display = 'block';
            submitButton.style.display = 'inline-block';
            retryButton.style.display = 'none';
            showAnswerButton.style.display = 'none';
            resultContainer.innerHTML = '';
            countdownElement.style.display = 'block'; 
            displayQuestion();
        }

        function showAnswer() {
            quizContainer.style.display = 'none';
            submitButton.style.display = 'none';
            retryButton.style.display = 'inline-block';
            showAnswerButton.style.display = 'none';

            let incorrectAnswersHtml = '';
            for (let i = 0; i < incorrectAnswers.length; i++) {
                incorrectAnswersHtml += `
      <p class="mb-5 pb-5 text-center">
        <strong>Soru:</strong> ${incorrectAnswers[i].question}<br>
        <strong>Cevabınız:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
        <strong>Doğru Cevap:</strong> ${incorrectAnswers[i].correctAnswer}
        <hr>
      </p>
    `;
            }

            resultContainer.innerHTML = `
    <p class="text-3xl text-[#ff5f5f] font-bold mb-5 text-center">Toplam Skor:  ${score} / ${quizData.length}!</p>
    <p class="text-2xl text-[#ff5f5f] font-bold mb-5 text-center">Yanlış Cevaplar:</p>
    ${incorrectAnswersHtml}
  `;
        }

        submitButton.addEventListener('click', checkAnswer);
        retryButton.addEventListener('click', retryQuiz);
        showAnswerButton.addEventListener('click', showAnswer);

        displayQuestion();
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });