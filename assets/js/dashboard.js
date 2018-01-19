$(document).ready(function() {
  $.get('data/affiliations.csv', function(csv) {
    $('#container').highcharts({
      chart: {
        type: 'pie'
      },
      data: {
        csv: csv
      },
      title: {
        text: 'Affiliations'
      },
      subtitle: {
        text: 'Current national support and consultancy projects (long-term projects not included)'
      },
      credits: { enabled: false }
    });
  }).fail(function() {
          $('#container').append("Sorry - missing data.");
  });
  $.get('data/subjects.csv', function(csv) {
    $('#container2').highcharts({
      chart: {
        type: 'pie'
      },
      data: {
        csv: csv
      },
      title: {
        text: 'Subjects'
      },
      subtitle: {
        text: 'Current national support and consultancy projects (long-term projects not included)'
      },
      credits: { enabled: false }
    });
  }).fail(function() {
          $('#container2').append("Sorry - missing data.");
  });
  $.get('data/requests.csv', function(csv) {
    $('#container3').highcharts({
      chart: {
        type: 'column'
      },
      data: {
        csv: csv
      },
      title: {
        text: 'Requests'
      },
      subtitle: {
        text: 'Requests for national support and consultancy projects past 12 months (long-term projects not included)'
      },
      credits: { enabled: false },
      yAxis: {
        min: 0,
        title: {
          text: null
        }
      },
      plotOptions: {
        series: {
          enableMouseTracking: false
        }
      },
      colors: ['#85BE42']
    });
  }).fail(function() {
          $('#container3').append("Sorry - missing data.");
  });
  $.get('data/github.csv', function(csv) {
    $('#container4').highcharts({
      chart: {
        type: 'bar'
      },
      data: {
        csv: csv
      },
      title: {
        text: 'Github commits'
      },
      subtitle: {
        text: 'Public <a href="https://github.com/NBISweden">GitHub</a> repos with most commits during the past 8 weeks'
      },
      credits: { enabled: false },
      yAxis: {
        min: 0,
        title: {
          text: null
        }
      },
      colors: ['#F47D20']
    });
  }).fail(function() {
          $('#container4').append("Sorry - missing data.");
  });
  $.get('data/timestamp.txt', function(ts, status) {
    $('#timestamp').append("Updated: " + ts);
  }).fail(function() {
          $('#timestamp').append("Sorry - missing data.");
  });


});

