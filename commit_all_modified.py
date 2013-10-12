import os
import sys
import re
import time
import subprocess
import codecs

class GitTool:

    def __init__(self):
        commands = sys.argv[1:]
        if '-m' in commands and len(commands) >= 2:
            self.commit_all_modified(commands[1])

    def add_all_modified(self):
        modified_files = self.get_modified_git_files()
        files = ''
        for f in modified_files:
            files += f + ' '
        files = files[0:len(files)-1]
        return subprocess.call('git add %s;' % (files), shell=True)
        
    def commit_all_modified(self, message):
        self.add_all_modified()
        if message is not None:
            return subprocess.call('git commit -m "%s"' % (message), shell=True)
        else:
            return -1

    def get_modified_git_files(self):
        local_files = os.listdir('.');
        modified_git_files = []
        
        tmp_file_name = "tmp_%s" % (int(time.time()))
        subprocess.call('git status > %s' % (tmp_file_name), shell=True)
       
        tmp_file = open(tmp_file_name)
        
        pattern = re.compile(r'^[#?](\s+)(modified:)(\s+)(.*)')

        for line in tmp_file.readlines():
            match = pattern.match(line)
            if match is not None:
                modified_git_files.append(match.group(4))
                
        tmp_file.close()
        subprocess.call('rm %s' % (tmp_file_name), shell=True)
        return modified_git_files

gittool = GitTool()
