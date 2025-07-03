#!/usr/bin/env python3
"""
Daily Report Script for Copilot Reviews in Hillspire Repositories
This script fetches pull requests created today and yesterday from all repositories
in the organization and sends an email report with Copilot reviews.
"""

import html
import os
from datetime import datetime, timezone, timedelta
import re
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


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
        'per_page': 20
    }
    
    url = f'https://api.github.com/repos/{org}/{repo}/pulls'
    r = requests.get(url, headers=headers, params=params)
    
    if r.status_code != 200:
        return [], []
    
    prs = r.json()
    #### Hai
    # print(today_str)
    # for pr in prs:
    #     print(pr['created_at'])
    #     print(pr['html_url'])
    #     print("----------------------")
        


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


# def list_comments_by_copilot(org, repo, pr_number):
#     """Get Copilot review comments for a specific pull request."""
#     headers = get_github_headers()
#     list_comments = ''
#     comments_url = f'https://api.github.com/repos/{org}/{repo}/pulls/{pr_number}/reviews'
    
#     r = requests.get(comments_url, headers=headers)
    
#     if r.status_code != 200:
#         return list_comments
    
#     for comment in r.json():
#         if comment['user']['login'] == 'copilot-pull-request-reviewer[bot]':
#             list_comments += '------- Review by copilot:\n' + comment['body'] + '\n\n'
    
#     return list_comments

#### Hai

def format_copilot_comment_html(comment_text):
    """Format Copilot comment text as HTML for email."""

    # Escape HTML
    html_text = html.escape(comment_text)
    
    # Basic formatting
    html_text = re.sub(r'^## (.+)$', r'<h2 style="color: #0366d6; margin: 16px 0 12px 0; font-size: 18px;">\1</h2>', html_text, flags=re.MULTILINE)
    html_text = re.sub(r'^### (.+)$', r'<h3 style="color: #0366d6; margin: 14px 0 10px 0; font-size: 16px;">\1</h3>', html_text, flags=re.MULTILINE)
    
    # Convert bullet points
    html_text = re.sub(r'^- (.+)$', r'<li>\1</li>', html_text, flags=re.MULTILINE)
    html_text = re.sub(r'(<li>.*?</li>(?:\s*<li>.*?</li>)*)', r'<ul style="margin: 12px 0; padding-left: 20px;">\1</ul>', html_text, flags=re.DOTALL)
    
    # Convert inline code
    html_text = re.sub(r'`([^`]+)`', r'<code style="background: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: monospace;">\1</code>', html_text)
    
    # Convert code blocks
    html_text = re.sub(r'```([^`]+)```', 
                      r'<pre style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 12px; overflow-x: auto; font-family: monospace; margin: 12px 0;"><code>\1</code></pre>', 
                      html_text, flags=re.DOTALL)
    
    # Convert line breaks
    html_text = html_text.replace('\n\n', '</p><p>')
    html_text = html_text.replace('\n', '<br>')

    html_text = html_text.replace(r'&lt;details&gt;', '')
    html_text = html_text.replace(r'&lt;/details&gt;', '')
    html_text = html_text.replace(r'&lt;summary&gt;', '')
    html_text = html_text.replace(r'&lt;/summary&gt;', '')
    
    return f'<div style="line-height: 1.5;"><p>{html_text}</p></div>'

# Usage in your existing script
def list_comments_by_copilot(org, repo, pr_number):
    """Get Copilot review comments formatted as HTML."""
    headers = get_github_headers()
    list_comments = ''
    comments_url = f'https://api.github.com/repos/{org}/{repo}/pulls/{pr_number}/reviews'
    
    r = requests.get(comments_url, headers=headers)
    
    if r.status_code != 200:
        return list_comments
    
    for comment in r.json():
        if comment['user']['login'] == 'copilot-pull-request-reviewer[bot]':
            formatted_comment = format_copilot_comment_html(comment['body'])
            list_comments += f'<div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid white; border-radius: 4px;"><strong style="color: #0366d6;">🤖 Copilot Review:</strong><br>{formatted_comment}</div>'
    
    return list_comments


def process_prs(repos, org, pr_type="open"):
    """Process pull requests and generate HTML report body."""
    html_body = ""

    for repo in repos:
        if pr_type == "open":
            prs = get_pull_requests(org, repo)[0]  # Get open PRs
        else:
            prs = get_pull_requests(org, repo)[1]  # Get closed PRs

        if not len(prs):
            continue

        repo_prs_with_comments = []

        for pr in prs:
            copilot_comments = list_comments_by_copilot(org, repo, pr['number'])
            if copilot_comments:
                repo_prs_with_comments.append({
                    'pr': pr,
                    'comments': copilot_comments
                })

        if not repo_prs_with_comments:
            continue

        # Generate HTML for this repository
        html_body += f"""
        <div style="margin-bottom: 40px;">
            <h2 style="color: #0366d6; border-bottom: 2px solid #e1e4e8; padding-bottom: 10px;">
                📁 Repository: {repo}
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background-color: #f6f8fa;">
                        <th style="border: 1px solid #d0d7de; padding: 12px; text-align: left; font-weight: 600;">Pull Request</th>
                        <th style="border: 1px solid #d0d7de; padding: 12px; text-align: left; font-weight: 600;">Copilot Review Comments</th>
                    </tr>
                </thead>
                <tbody>
        """

        for item in repo_prs_with_comments:
            pr = item['pr']
            comments = item['comments']

            # Format comments for HTML
            formatted_comments = comments.replace('\n', '<br>')
            formatted_comments = formatted_comments.replace('------- Review by copilot:', '<strong>🤖 Copilot Review:</strong>')

            html_body += f"""
                    <tr style="border-bottom: 1px solid #e1e4e8;">
                        <td style="border: 1px solid #d0d7de; padding: 12px; vertical-align: top; width: 30%;">
                            <div style="margin-bottom: 8px;">
                                <strong>#{pr['number']}: {pr['title']}</strong>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <span style="background-color: #{'28a745' if pr['state'] == 'open' else '#6f42c1'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                    {pr['state'].upper()}
                                </span>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <strong>Author:</strong> {pr['user']['login']}
                            </div>
                            <div style="margin-bottom: 8px;">
                                <strong>Created:</strong> {pr['created_at'][:10]}
                            </div>
                            <div>
                                <a href="{pr['html_url']}" style="color: #0366d6; text-decoration: none;">
                                    🔗 View PR
                                </a>
                            </div>
                        </td>
                        <td style="border: 1px solid #d0d7de; padding: 12px; vertical-align: top;">
                            <div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #0366d6;">
                                {formatted_comments}
                            </div>
                        </td>
                    </tr>
            """

        html_body += """
                </tbody>
            </table>
        </div>
        """

    return html_body


def send_email(html_body):
    today = datetime.now(timezone.utc).date()
    today_str = today.strftime('%Y-%m-%d')
    """Send HTML email with the report."""
    # Create multipart message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '📊 Daily Report for Copilot Reviews in Hillspire Repositories - {}'.format(today_str)
    msg['From'] = os.environ['GMAIL_USER']

    recipients = ['hlengoc.fpt@hillspire.com', 'enterprise-app-dev@hillspire.com']
    msg['To'] = ', '.join(recipients)

    # Create the complete HTML email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Copilot Report</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #24292e;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }}
            .header p {{
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }}
            .section-title {{
                background-color: #f6f8fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #0366d6;
                margin: 30px 0 20px 0;
            }}
            .section-title h2 {{
                margin: 0;
                color: #0366d6;
                font-size: 24px;
            }}
            .no-data {{
                text-align: center;
                padding: 40px;
                color: #586069;
                font-style: italic;
                background-color: #f8f9fa;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 40px;
                padding: 20px;
                text-align: center;
                color: #586069;
                font-size: 14px;
                border-top: 1px solid #e1e4e8;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🤖 Daily Copilot Review Report</h1>
            <p>Hillspire Repositories • {datetime.now(timezone.utc).strftime('%B %d, %Y')}</p>
        </div>

        <div class="section-title">
            <h2>🟢 Open Pull Requests with Copilot Reviews</h2>
        </div>
        {html_body.split('LIST OF CLOSED PRs')[0] if 'LIST OF CLOSED PRs' in html_body else html_body}

        <div class="section-title">
            <h2>🔴 Closed Pull Requests with Copilot Reviews</h2>
        </div>
        {html_body.split('LIST OF CLOSED PRs')[1] if 'LIST OF CLOSED PRs' in html_body else '<div class="no-data">No closed PRs with Copilot reviews found for today/yesterday.</div>'}

        <div class="footer">
            <p>Generated automatically by GitHub Actions • Hillspire DevOps Team</p>
            <p>📧 This report includes PRs created today and yesterday with Copilot review comments</p>
        </div>
    </body>
    </html>
    """

    # Create HTML part
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(os.environ['GMAIL_USER'], os.environ['GMAIL_PASS'])
            server.sendmail(msg['From'], recipients, msg.as_string())
        print("HTML email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")


def main():
    """Main function to generate and send the daily report."""
    try:
        org = os.environ['ORG_NAME']
        repos = get_repos(org)

        print(f"Processing {len(repos)} repositories for organization: {org}")

        # Process open PRs
        print("Processing open PRs...")
        open_prs_body = process_prs(repos, org, "open")

        # Process closed PRs
        print("Processing closed PRs...")
        closed_prs_body = process_prs(repos, org, "closed")

        # Combine both sections
        html_body = open_prs_body + "LIST OF CLOSED PRs" + closed_prs_body

        if not open_prs_body and not closed_prs_body:
            html_body = '<div class="no-data">No pull requests with Copilot reviews found for today/yesterday.</div>'
            print("No PRs with Copilot reviews found.")
        else:
            print(f"Found PRs with Copilot reviews. Sending email...")

        # Send HTML email
        send_email(html_body)

    except Exception as e:
        print(f"Error in main execution: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
