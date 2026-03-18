import axios from 'axios';
(async () => {
  try {
    const res = await axios.get('https://hack-event-backend-ruby.vercel.app/events');
    const current = res.data.find(e => e.status === 'current') || res.data[0];
    console.log('Event:', current.id);
    const scoreRes = await axios.get('https://hack-event-backend-ruby.vercel.app/teams/scoreboard/' + current.id);
    console.log('Scoreboard:', scoreRes.data);
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
})();
