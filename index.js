const GithubApiWrapper = require('./lib/github');

const github = new GithubApiWrapper();

github.getCommits('thomahau', 'assignment_royalty_free_music_player', (results) => {
  console.dir(results, { depth: null, colors: true });
});
