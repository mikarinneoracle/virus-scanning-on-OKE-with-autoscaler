OCI_CLI_AUTH=instance_principal

/root/bin/oci -v
uvscan --version

exit

rm -f report.txt
rm -rf scandir
mkdir scandir
echo "Scanning $1"
/root/bin/oci os get --bucket-name scanning-ms --name $1 --region eu-amsterdam-1 --file scandir/$1
uvscan -v --unzip --analyze --summary --afc 512 --program --mime --recursive --threads=$(nproc) --report=report.txt --rptall --rptcor --rpterr --rptobjects scandir
isInFile=$(cat report.txt | grep -c "Possibly Infected:.............     0")
if [ $isInFile -eq 0 ]; then
   echo "################# ALERT!!! Scanning found infected files ! #################"
   /root/bin/oci os object put --bucket-name scanning-ms-alert-report --region eu-amsterdam-1 --file report.txt --force
else
   echo "################# Scanning found no infected files #################"
   /root/bin/oci os object put --bucket-name scanned-ms --region eu-amsterdam-1 --file report.txt --force
   /root/bin/oci os object put --bucket-name scanned-ms --region eu-amsterdam-1 --file scandir/$1 --force
fi
/root/bin/oci os object delete --bucket-name scanning-ms --object-name $1 --region eu-amsterdam-1 --force
