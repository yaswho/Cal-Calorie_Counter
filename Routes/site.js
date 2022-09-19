const express = require('express');
const router = express.Router();
const utils = require('./../Utils/utils');
const Paciente = require('../models/Paciente');
const Chronos = require('./../Utils/Chronos'); 
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'svg', width: 800, height: 600 }); 

function isMonth(value)
{
	return Object.keys(months).includes(value);
}

router.get('/', async (req,res) => {

	var isoff = await utils.canRedirect(req);

	res.render("index", {
        title: "Cal - Página Inicial",
		isOff: isoff
    });
})

router.get('/registrar', (req,res) => {
	const arr = [];
	res.render("registrar", {
        title: "Cal - Registro",
		arr: arr.toString()
    });
})

router.get('/login', async (req,res) => {

	var t = await utils.canRedirect(req)

	res.render("login", {
        title: "Cal - Login",
		token: !t
    });
})

router.get('/perfil', utils.verifyJWT, async (req, res, next) => {

	const user = req.user;
	var img;

	if(user['imagem'] == null)
	{
		img = '/public/imgs/usuario.jpg'
	} else img = user.imagem;

	const imc = utils.imc(user.peso, user.altura);   
	//Imprimir no HTML 
	res.render("perfil", {
        title: "Cal - Perfil",
		name: user.nome_paciente,
		altura: user.altura,
		peso: user.peso,
		peso_anterior: utils.getLast(user.peso_anterior, user.peso).peso,
		imc: imc,
		img: img,
		pontos: user.pontos
    });

})


//Rota para troca de pontos
router.get('/trocadepontos', utils.verifyJWT, async(req, res, next) => {

	const user = req.user;
	 
	//Imprimir no HTML 
	res.render("trocadepontos", {
        title: "Cal - Troca de Pontos",
		name: user.nome_paciente,
		altura: user.altura,
		peso: user.peso,
		peso_anterior: utils.getLast(user.peso_anterior, user.peso).peso,
		pontos: user.pontos
    });
})


//Gráficos
router.get('/graficos', utils.verifyJWT, async(req, res, next) => {

	const user = req.user;

	const months = {
		1: "Jan",
		2: "Fev",
		3: "Mar",
		4: "Abr",
		5: "Mai",
		6: "Jun",
		7: "Jul",
		8: "Ago",
		9: "Set",
		10: "Out",
		11: "Nov",
		12: "Dez",
	}

		const width = 1280/2; //px
		const height = 720/2; //px
		const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
		const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

		const data = {
			labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
			datasets: [{
			  label: ' Desempenho de peso',
			  data: utils.datalize(user),
			  fill: false,
			  borderColor: 'rgb(75, 192, 192)',
			  tension: 0.1,
			  showLine: true
			}]
		  };

		  
		(async () => {
			const configuration = {
				type: 'scatter',
				data: data,
				options: {
					scaleShowValues: true,
					responsive: true,
					showTooltips: true,
					plugins: {
						display: true,
						legend: true,
						title: {
							display: true,
							//text: "EXEMPLO"
						},
						tooltip: {
							enabled: true,
							callbacks: {
								label: function(context) {
									var label = context.dataset.label || '';

									if (label) {
										label += ': ';
									}
									if (context.parsed.y !== null) {
										label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
									}
									return "AMOR";
                    			}
							}
						}
					},
					scales: {
					   y: {
							stacked: true,
							min: 10,
							max: 300,
							ticks: {
								stepSize: 2
							},
							title: {
								display: true,
								text: "Massa (Kg)"
							}
					   },
					   x: {
							suggestedMin: 0,
                			suggestedMax: 13,
							title: {
								display: true,
								text: "Tempo"
							},
							ticks: {
								autoSkip: false,
  								callback: value => Number.isInteger(value) ? months[value] : null,
								stepSize: 0.1,
							}
					   }
					 },
					 elements: {
						line: {
							tension: .1, // bezier curves
						}
					 }
				},

			};

			const image = await chartJSNodeCanvas.renderToBuffer(configuration);
			const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);

			res.render("graficos", {
				title: "Cal - Graficos",
				name: user.nome_paciente,
				altura: user.altura,
				peso: user.peso,
				peso_anterior: JSON.stringify(user.peso_anterior),
				buffer: dataUrl.toString()
			});

		})();
})

router.get('/registro/:authId',(req,res) =>{

	if(Chronos.hasEmailTime(utils.decrypt(req.params.authId)))
	{
		const query = utils.createURLFeedback("Cal - Feedback",
			"Erro ao cadastrar",
			"Requisite outra chave de segurança preenchendo o formulário de cadastro novamente.",
			"error-1",
			"error.png");

		res.redirect(query);

	} else res.render('registro', { title: "Cal - Finalize o registro", session: req.params.authId });

});

router.get('/feedback', async(req, res, next) => {
	const feedback = JSON.parse(utils.decrypt(req.query.r));
	res.render('feedback', {...feedback});
})

module.exports = router;