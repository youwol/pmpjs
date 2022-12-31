#!/usr/bin/python
import os
import os.path
import shutil
import sys

def replace( replace_list ):
    path = os.path.join( "../js/", "pmp.js")
    f = open( path, "r" )
    lines = f.readlines()
    f.close()
    result = ""
    changed = False
    for line in lines:
        replaced = line
        for conf in replace_list:
            replaced = replaced.replace( conf[0], conf[1] )
            if changed == False and replaced != line:
                changed = True
        result = result + replaced
    if changed == True:
        f = open( path,"w" )
        f.write( result )
        f.close()

replace_list = [ ["Module", "PmpModule"] ]

def usage():
    print("replace.py")
    print("Replace any occurences of 'CurrentName' by 'NewName' in ../js/pmp.js")
    sys.exit(0)

if __name__ == '__main__':
    replace( replace_list )