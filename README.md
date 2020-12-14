# MailMergeExercise

Our users want to send personalized emails to a list of their members.  The goal of this exercise is to create a small application that makes it easy to do that.

The front end web page lets the user define a template and enter a list of member emails along with values for the variables in the template.  

A backend server receives the template and the key-value pairs for a given member.  It sends an email whose body is the result of rendering the template.  
 
## Front end flow

Use React and Nextjs.  Add more packages as needed.

- The user defines a template, using plain text.  See example below.
- The app displays a form allowing the user to enter a set of values for the template variables, including the recipient's email.
- The user fills out the form and specifies the sender's email.
- The app displays a preview.
- The user clicks the Send button.
- The app shows whether the email was successfully sent, otherwise displays an error message.


## Backend API

Use Express and SendGrid.  Add more packages (such as a template engine, not required) as needed.

- Render the template and return the result to the front end.
- Send the email to the recipient using the SendGrid API (see below for link).


## Example template and fields

```
Good Morning %%member_first_name%%,

Your membership in %%institution%% is due for renewal on %%renewal_date%%.  
The membership fee is %%membership_fee%%.
Please log in to Galigo and fill out your renewal application.
```

The field names for this template, with sample values:

```
contact_first_name => Joe
institution => Singapore Green Building Council
renewal_date => January 1, 2021
membership_fee => $50
```

## SendGrid

Get a free account for SendGrid here: 

  https://app.sendgrid.com/signup

## Submit your entry

Submit a pull request to this repo.


