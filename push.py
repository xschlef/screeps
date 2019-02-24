#!/usr/bin/python3
import requests
import os
import json
import sys

src_dir = sys.argv[1]
branch = "default"
if len(sys.argv) > 2:
    branch = sys.argv[2]

with open(".screeps_login") as auth:
    auth_data = json.load(auth)

req = {
    'data': {
        'branch': branch,
        'modules': {}
    }
}

for f in os.scandir(src_dir):
    with open(f) as script:
        print("Adding %s" % str(f.name))
        req['data']['modules'][os.path.basename(f)] = script.readlines()

headers = {"Content-Type": "application-json; charset = utf-8"}
r = requests.post("https://screeps.com/api/user/code", auth=(auth_data['user'], auth_data['password']), headers=headers, data=req)
if(r.status_code == 200):
    print("Pushed %s successfully to branch %s" % (src_dir, branch))
