var cur_idx = 0;
var tick_start = 0;

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function element_wise_equal(a, b) {
  return a.map(function(e, idx) { return e === b[idx]; });
}

function next_char() {
  if (cur_idx < v_results.ground_truth.length) {
    var cur_time = new Date().getTime();
    v_results.time_spent.push(cur_time - tick_start);
    v_results.answer_sheet.push(challenge.answer);
    tick_start = cur_time;
    console.log(challenge.appearance + ' => ' + challenge.pronunciation + ' , answer: ' + challenge.answer + ' (time spent: ' + v_results.time_spent[v_results.time_spent.length - 1] + ' ms)');
    cur_idx += 1;

    if (cur_idx === v_results.ground_truth.length) {
      console.log('finished.')
      $.ajax({
        url: 'http://localhost:5000/trial/',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          username: user.username,
          results: {
            ground_truth: v_results.ground_truth,
            answer_sheet: v_results.answer_sheet,
            time_spent: v_results.time_spent
          }
        }),
        error: function (error) {
          alert(JSON.stringify(error));
        }
      });
    } else {
      challenge.appearance = v_results.ground_truth[cur_idx].appearance;
      challenge.pronunciation = v_results.ground_truth[cur_idx].pronunciation;
      challenge.answer = "";
      $('#challenge input').focus()
    }
  }
}

var challenge = new Vue({
  el: '#challenge',
  data: {
    appearance: "_",
    pronunciation: "",
    answer: ""
  },
  mounted: function () {
    var self = this;
    $.ajax({
        url: 'http://localhost:5000/character/?max_results=100',
        method: 'GET',
        success: function (data) {
            v_results.ground_truth = data._items.map( function(x) {
              return { appearance: x.appearance, pronunciation: x.pronunciation };
            }).slice(0, 10);
            shuffle(v_results.ground_truth);
            self.appearance = v_results.ground_truth[cur_idx].appearance;
            self.pronunciation = v_results.ground_truth[cur_idx].pronunciation;
            tick_start = new Date().getTime();
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
  },
  methods: {
    key_enter: function (event) {
      if(event.key == "Enter") {
        next_char();
      }
    }
  }
});

var user = new Vue({
  el: "#username",
  data: {
    username: "anonymous"
  }
});

var next_btn = new Vue({
  el: '#next_btn',
  methods: {
    next: next_char
  }
});

var v_results = new Vue({
  el: '#results',
  data: {
    answer_sheet: [],
    ground_truth: [],
    time_spent: []
  },
  computed: {
    is_trial_finished: function() {
      return this.ground_truth.length > 0 && this.answer_sheet.length === this.ground_truth.length;
    },
    num_correct_challenges: function () {
      return element_wise_equal(this.answer_sheet, this.ground_truth.map(x => x.pronunciation)).reduce(function(x, y) { return y + x; });
    },
    num_total_challenges: function () {
      return this.ground_truth.length;
    },
    avg_time_spent: function () {
      total_spent = this.time_spent.reduce(function(x, y) {return x + y;} );
      return total_spent / this.time_spent.length;
    }
  }
});