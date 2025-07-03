#!/usr/bin/env python3
"""
Daily Report Script for Copilot Reviews in Hillspire Repositories
This script fetches pull requests created today and yesterday from all repositories
in the organization and sends an email report with Copilot reviews.
"""

import os
from datetime import datetime, timezone, timedelta
import requests
import smtplib
from email.mime.text import MIMEText


def get_github_headers():
    """Get GitHub API headers with authentication."""
    return {
        'Authorization': f'token {os.environ["GH_TOKEN"]}',
        'Accept': 'application/vnd.github+json'
    }


def get_repos(org):
    """Get all repositories from the organization."""
    headers = get_github_headers()
    repos = []
    page = 1
    
    while True:
        url = f'https://api.github.com/orgs/{org}/repos?per_page=100&page={page}'
        r = requests.get(url, headers=headers)
        
        if r.status_code != 200 or not r.json():
            break
            
        repos.extend(r.json())
        page += 1
    
    return [repo['name'] for repo in repos]


def get_pull_requests(org, repo):
    """Get pull requests created today and yesterday from a repository."""
    headers = get_github_headers()
    today = datetime.now(timezone.utc).date()
    yesterday = today - timedelta(days=1)
    
    # Format dates for comparison
    yesterday_str = yesterday.strftime('%Y-%m-%d')
    today_str = today.strftime('%Y-%m-%d')
    
    params = {
        'state': 'all',
        'sort': 'created',
        'direction': 'desc',
        'per_page': 5
    }
    
    url = f'https://api.github.com/repos/{org}/{repo}/pulls'
    r = requests.get(url, headers=headers, params=params)
    
    if r.status_code != 200:
        return [], []
    
    prs = r.json()
    #### Hai
    print(today_str)
    for pr in prs:
        print(pr['created_at'])
        print(pr['html_url'])
        print("----------------------")
        


    # Filter PRs created today or yesterday
    open_prs = [
        pr for pr in prs 
        if ((pr['created_at'].split('T')[0] == today_str) or 
            (pr['created_at'].split('T')[0] == yesterday_str)) and 
           (pr['state'] == 'open')
    ]
    
    closed_prs = [
        pr for pr in prs 
        if ((pr['created_at'].split('T')[0] == today_str) or 
            (pr['created_at'].split('T')[0] == yesterday_str)) and 
           (pr['state'] == 'closed')
    ]
    
    print(f"Repository {repo}: {len(open_prs)} open PRs, {len(closed_prs)} closed PRs")
    return open_prs, closed_prs


def list_comments_by_copilot(org, repo, pr_number):
    """Get Copilot review comments for a specific pull request."""
    headers = get_github_headers()
    list_comments = ''
    comments_url = f'https://api.github.com/repos/{org}/{repo}/pulls/{pr_number}/reviews'
    
    r = requests.get(comments_url, headers=headers)
    
    if r.status_code != 200:
        return list_comments
    
    for comment in r.json():
        if comment['user']['login'] == 'copilot-pull-request-reviewer[bot]':
            list_comments += '------- Review by copilot:\n' + comment['body'] + '\n\n'
    
    return list_comments


def process_prs(repos, org, pr_type="open"):
    """Process pull requests and generate report body."""
    body = ""
    
    for repo in repos:
        if pr_type == "open":
            prs = get_pull_requests(org, repo)[0]  # Get open PRs
        else:
            prs = get_pull_requests(org, repo)[1]  # Get closed PRs
            
        if not len(prs):
            continue
            
        num_copilot_comments = 0
        pr_body = ''
        
        for pr in prs:
            copilot_comments = list_comments_by_copilot(org, repo, pr['number'])
            if not copilot_comments:
                continue
                
            num_copilot_comments += 1    
            pr_body += f'--- PR #{pr["number"]}: {pr["title"]} ({pr["html_url"]})\n\n'
            pr_body += copilot_comments
            
        if num_copilot_comments == 0:
            continue
        else:
            body += f'Repository: {repo}\n\n'
            body += pr_body  
            body += '-' * 138 + '\n'
            body += '-' * 138 + '\n\n\n'
    
    return body


def send_email(body):
    """Send email with the report."""
    msg = MIMEText(body)
    msg['Subject'] = 'Daily Report for Copilot reviews in Hillspire repositories'
    msg['From'] = os.environ['GMAIL_USER']
    
    recipients = ['hlengoc.fpt@hillspire.com']
    msg['To'] = ', '.join(recipients)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(os.environ['GMAIL_USER'], os.environ['GMAIL_PASS'])
            server.sendmail(msg['From'], recipients, msg.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")


def main():
    """Main function to generate and send the daily report."""
    try:
        org = os.environ['ORG_NAME']
        # repos = get_repos(org)
        repos = ['app.ims']
        get_pull_requests(org, repos[0])
        # # Build email body
        # body = '*' * 48 + ' DAILY REPORT FOR COPILOT REVIEWS IN HILLSPIRE REPOSITORIES ' + '*' * 48 + '\n\n\n'
        # body += '*' * 62 + ' LIST OF OPEN PRs TODAY ' + '*' * 83 + '\n\n\n'
        
        # # Process open PRs
        # open_prs_body = process_prs(repos, org, "open")
        # body += open_prs_body
        
        # # Process closed PRs
        # body += '*' * 60 + ' LIST OF CLOSED PRs TODAY ' + '*' * 85 + '\n\n\n'
        # closed_prs_body = process_prs(repos, org, "closed")
        # body += closed_prs_body
        
        # print('Email body:')          
        # print(body)
        
        # # Send email
        # send_email(body)
        
    except Exception as e:
        print(f"Error in main execution: {e}")


if __name__ == "__main__":
    main()
