var all_chars = [];
var cur_idx = 0;
var tick_start = 0;

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function next_char() {
  if (cur_idx < all_chars.length) {
    var cur_time = new Date().getTime();
    results.time_spent.push(cur_time - tick_start);
    results.judgement.push(challenge.pronunciation === challenge.answer);
    tick_start = cur_time;
    console.log(challenge.appearance + ' => ' + challenge.pronunciation + ' , answer: ' + challenge.answer + ' (time spent: ' + results.time_spent[results.time_spent.length - 1] + ' ms)');
    cur_idx += 1;

    if (cur_idx === all_chars.length) {
      results.finished = true;
      console.log('finished.')
    } else {
      challenge.appearance = all_chars[cur_idx].appearance;
      challenge.pronunciation = all_chars[cur_idx].pronunciation;
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
        url: 'http://localhost:5000/character/?max_results=50',
        method: 'GET',
        success: function (data) {
            all_chars = data._items;
            shuffle(all_chars);
            self.appearance = all_chars[cur_idx].appearance;
            self.pronunciation = all_chars[cur_idx].pronunciation;
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

var next_btn = new Vue({
  el: '#next_btn',
  methods: {
    next: next_char
  }
});

var results = new Vue({
  el: '#results',
  data: {
    finished: false,
    judgement: [],
    time_spent: []
  },
  computed: {
    num_correct_challenges: function () {
      return this.judgement.reduce(function(x, y) { return y + x; });
    },
    num_total_challenges: function () {
      return this.judgement.length;
    },
    avg_time_spent: function () {
      total_spent = this.time_spent.reduce(function(x, y) {return x + y;} );
      return total_spent / this.time_spent.length;
    }
  }
});