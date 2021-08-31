## Newsletter API

### To start this app follow the instruction

*Install Dependencies*
* Use npm or yarn to install the required dependencies
```console
foo@bar:~$ npm i (or) yarn
```

*Optional Dependency*
* Insall PM2 (this step is optional)
```console
foo@bar:~$ npm i -g pm2 (or) yarn global add pm2
```

*Update the envinorments variables based on the [.env.sample][env] file*
  * DATABASE_URL => Postres Database url
  * ROW_TO_BE_PROCCESSED => Number of rows to be processed from the csv file
  * SMPT_URL => SMPT url
  * Sample SMPT URL for GMail
  ```console
  smtps://${encodeURIComponent(email)}:${encodeURIComponent(password)}@smtp.gmail.com:465
  ```
  * RABBITMQ_URL => RabbitMQ's connection url
  * EMAIL_QUEUE => Email queue's name
  * FAILURE_QUEUE => Failure queue's name
  * EMAIL_PREFETCH => Number of prefetch for each worker

*Start the server*
  * Using PM2
  ```console
  pm2 start startup.yaml
  ```
  * Other Method
    * To start the server and publisher 
    ```console
    npm run start (or) yarn start
    ```
    * To start the consumer 
    ```console
    npm run email_queue (or) yarn email_queue
    ```

*Note*
  * Refer [this][csv] file for sample CSV file
  * The [postman collection][postman] is also included
  * The Newsletter Content in the csv can be of type handlebar template.
    * {{name}} will be replaced by the first name and last name.
    * {{age}} will be replaced by the age provided. 

[env]: https://github.com/jehincastic/newsletter-api/blob/master/.env.sample
[postman]: https://github.com/jehincastic/newsletter-api/blob/master/sample_files/postman_collection.json
[csv]: https://github.com/jehincastic/newsletter-api/blob/master/sample_files/sample_data.csv
