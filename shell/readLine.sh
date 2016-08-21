# Read from the file $1 and output the line which index is $2 to stdout
# But you can also use sed -n $2q $1
index=0
while read line
do
	index=`expr $index + 1`
	if [ $index -eq $2 ]
	then
		echo "${line}"
	fi
done < $1
