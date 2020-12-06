FROM node:10.16.3
COPY ./services /services
COPY ./nodeStart.sh /autoExec/nodeStart.sh
WORKDIR /services
RUN npm install nodemon -g
RUN npm install
RUN chmod +x /autoExec/nodeStart.sh
ENV PORT 3000
EXPOSE 3000
CMD ["/autoExec/nodeStart.sh"]
