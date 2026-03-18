import axios from 'axios';
(async () => {
  try {
    const res = await axios.get('https://hack-event-backend-ruby.vercel.app/teams');
    if(res.data.length === 0) return console.log('No teams found');
    console.log('Teams Scores:');
    res.data.forEach(t => {
      console.log('Team ' + t.id + ' (' + t.name + '): Practical=' + t.practical_score + ', Theoretical=' + t.theoretical_score + ', Total=' + (t.practical_score + t.theoretical_score));
    });
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
})();
