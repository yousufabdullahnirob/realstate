#!/usr/bin/env python
import os
import sys

def main():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, BASE_DIR)
    sys.path.insert(0, os.path.join(BASE_DIR, 'real_estate_backend'))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()