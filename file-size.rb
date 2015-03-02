require 'grit'

if ARGV.size < 1
  puts 'usage: file-size FILE'
  puts 'run from within the git repo root'
  exit
end

filename = ARGV[0].to_s

repo = Grit::Repo.new('.')
commits = repo.log('master', filename)
commits.each do |commit|
  blob = commit.tree/filename
  puts "#{blob.size}"
end
