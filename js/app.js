(function () {
  'use strict'
  var App = function () {
    if (App.instance) {
      return App.instance
    }
    App.instance = this
    this.init()
  }
  App.prototype = {
    init: function () {
      this.getFile();
      this.lodashValidate();
      this.lodashDeburr();
    },

    dataManipulation: function (dataObject) {
      var object = _.cloneDeep(dataObject);

      var tallPerson = _.find(dataObject, function (tallPerson) {
        return tallPerson['Height'] > 200;

      });
      console.log(tallPerson);

      var removeDuplicates = _.uniqBy(dataObject, 'Name');
      console.log(removeDuplicates);

      function AddDogs() {
        var addedDogs = {'Dogs': _.random(0, 3)};
        return addedDogs;
      }

      _.forEach(removeDuplicates, function (value, index) {
        _.assign(removeDuplicates[index], new AddDogs());

      });

      var sortedName = _.sortBy(removeDuplicates, 'Height');
      console.log(sortedName);

      this.assignments(object);
    },

    assignments: function (data) {
      // Lodash documentation       https://lodash.com/docs/4.17.4

      // Tekita andmetele juurde juhuslikult valitud 0-100 väärtustega 'Luck'   {Name: "Juku", Height: "170", Mass: "45", Sex: "m", Luck: 50?}
        function AddLuck() {
            var addedLuck = {'Luck': _.random(0, 100)};
            return addedLuck;
        }

        _.forEach(data, function(value, index) {
          _.assign(data[index], new AddLuck());
        });
        console.log(data);

      // Tekita uus massiiv, kus on inimesed, kelle pikkus jagub kahega
        var dividedHeight = _.remove(data, function(value) {
          return value.Height % 2 === 0;
        });

        console.log(dividedHeight);

      // Tekita massiivist sügav kloon(deepclone) ning leia kolm funktsiooni mida tahaksid kasutada oma uue massiivi peal (Kui ei taha ühtegi, siis teed ikka)
      // Kui masiivi sees olevate objektidega mässamine ei ole sinu teema, siis kasuta funktsiooni, et genereerida endale uus array ning tegutse sellega
        var object = _.cloneDeep(dividedHeight);

        console.log(object);

      // Saada kõige esimene massiiv (Luck'iga) initChart funktsiooni sisse niimoodi ( this.initChart(data))
        this.initChart(data);
    },

    lodashDeburr: function () {
      var stranger = $('.stranger-name').html()
      $('.js-stranger').on('click', function () {
        stranger = _.deburr(stranger)
        $('.stranger-name').html(stranger)
        $('.stranger-remove').remove()
        $('.stranger-exposed').toggle()
      })
    },
    lodashValidate: function () {
      $('.js-validate').on('keyup', _.debounce(debounceIt, 500))

      function debounceIt () {
        if ($('.js-validate').val().toLowerCase().indexOf('lodash') === -1) {
          if ($('.validate-text').hasClass('validate-error')) {
            $('.validate-text').animate({
              'font-size': '18px'
            }, 100)
            $('.validate-text').animate({
              'font-size': '14px'
            }, 100)
          }
          $('.validate-text').addClass('validate-error').removeClass('validate-success').html('Vajab rohkem lodashi')
          $('.validate-text').slideDown()
        } else {
          $('.validate-text').addClass('validate-success').removeClass('validate-error').html('Piisav lodash kätte saadud')
          $('.js-stranger').toggle()
        }
      }
    },

    getFile: function () {
      var itemPath = 'data/data.txt'
      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          App.instance.dataTransform(this.responseText)
        }
      }
      xhttp.open('GET', itemPath, true)
      xhttp.send()
    },

    dataTransform: function (data) {
      var splitData = _.split(data, '\n');
      var headers = _.at(splitData, '0');
      headers = _.split(headers, ',');
      var changedData = _.slice(splitData, 1, splitData.length);

      var dataObject = []
        _.forEach(changedData, function (values, index) {
          var person = _.split(values, ',')
            dataObject[index] = { }
            _.forEach(headers, function (values, key) {
              dataObject[index][headers[key]] = person[key]

            })

        })
        console.log(dataObject)

      this.dataManipulation(dataObject);
    },

    getIndividualStat: function (dataObject, type) {
      var statArray = [];

      _.forEach(dataObject, function (value, index) {
          statArray[index] = dataObject[index][type]
      });
      return statArray;

    },
    getDataColors: function (dataObject, type) {
      var colorArray = [];

      _.forEach(dataObject, function (value, index) {
          if(value['Sex'] === 'm' && type === 'Height') {
            colorArray[index] = '#417DC1';
          } else if(value['Sex'] === 'n' && type === 'Height') {
              colorArray[index] = '#D982B5';
          } else if(value['Sex'] === 'm') {
              colorArray[index] = '#86ACD7';
          } else {
              colorArray[index] = '#E6AFCF';
          }

      });
      return colorArray;
    },
      
    initChart: function (dataObject) {
      var ctx = document.getElementById('myChart').getContext('2d')
      Chart.defaults.global.defaultFontColor = '#fff'
      Chart.defaults.global.defaultColor = 'rgba(0,0,0,0.1)'
      var config = {
        type: 'bar',
        data: {
          labels: this.getIndividualStat(dataObject, 'Name'),
          datasets: [{
            label: 'Height',
            fill: false,
            data: this.getIndividualStat(dataObject, 'Height'),
            backgroundColor: this.getDataColors(dataObject, 'Height'),
            borderColor: this.getDataColors(dataObject, 'Height')
          }, {
            label: 'Mass',
            fill: false,
            data: this.getIndividualStat(dataObject, 'Mass'),
            backgroundColor: this.getDataColors(dataObject, 'Mass'),
            borderColor: this.getDataColors(dataObject, 'Mass')
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
            labels: {
              fontColor: 'white'
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: 'white'
              }
            }]
          }
        }
      }
      if (dataObject['Luck'] !== null) {
        config.data.datasets[2] = {
          label: 'Luck',
          fill: false,
          data: this.getIndividualStat(dataObject, 'Luck'),
          backgroundColor: '#C3FF9B',
          borderColor: '#C3FF9B'
        }
      }
      console.log(config)
      var myChart = new Chart(ctx, config)
    }

  }

  window.onload = function () {
    var application = new App()
  }
})()
