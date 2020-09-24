package edu.hawaii.its.groupings.service;

import org.apache.commons.logging.LogFactory;
import org.apache.commons.logging.Log;

import org.springframework.stereotype.Service;

//change name to message banner service
@Service
public class MessageService {
    //
    private static final Log logger = LogFactory.getLog(EmailService.class);

    private static int count = 0;

    //@Value("${groupings.outage.file}")
    // Resource outageMessage;
    public String find(int messageId) {

        logger.info("looking for the message " + messageId);

        if (!isServerUp()) {
            return "system is down; count: " + count;
        }

        //retreive the message from the server
        return "Real message going down; messageId: " + messageId;
    }

    public Boolean exists(int messageId) {
        //ask the server if there is a valid message
        return true;
    }

    //ping the server check if it is up
    private Boolean isServerUp() {
        //checking if the server is alive
        if (count++ % 3 == 0) {
            return false;
        }
        return true;
    }
}

