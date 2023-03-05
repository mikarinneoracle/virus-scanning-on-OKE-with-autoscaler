/root/bin/oci -v
/root/bin/oci os ns get --auth instance_principal
#uvscan --version
rm -f report.$1.txt
rm -rf scandir
mkdir scandir
echo "Scanning $1 $2"
if ( "$2" eq "delete"); then
    echo "Deleting $2 only"
    /root/bin/oci os object delete --bucket-name scanning-ms --object-name $1 --region eu-amsterdam-1 --force --auth instance_principal
    exit
fi

/root/bin/oci os object get --bucket-name scanning-ms --name $1 --region eu-amsterdam-1 --file scandir/$1 --auth instance_principal
uvscan -v --unzip --analyze --summary --afc 512 --program --mime --recursive --threads=$(nproc) --report=report.$1.txt --rptall --rptcor --rpterr --rptobjects scandir
isInFile=$(cat report.$1.txt | grep -c "Possibly Infected:.............     0")
if [ $isInFile -eq 0 ]; then
   echo "################# ALERT!!! Scanning found infected files ! #################"
   /root/bin/oci os object put --bucket-name scanning-ms-alert-report --region eu-amsterdam-1 --file report.$1.txt --force --auth instance_principal
else
   echo "################# Scanning found no infected files #################"
   /root/bin/oci os object put --bucket-name scanned-ms --region eu-amsterdam-1 --file report.$1.txt --force --auth instance_principal
   #/root/bin/oci os object put --bucket-name scanned-ms --region eu-amsterdam-1 --file scandir/$1 --force --auth instance_principal
fi
/root/bin/oci os object delete --bucket-name scanning-ms --object-name $1 --region eu-amsterdam-1 --force --auth instance_principal
