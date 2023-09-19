import React from "react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
	Box,
	List,
	ListItem,
	ListItemText,
	Typography,
	useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../Theme";
import { pink } from "@mui/material/colors";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import api from "../../services/api";
const Calendar = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [currentEvents, setCurrentEvents] = useState([]);

	const getEventos = async () => {
		try {
			const res = await api.post("eventos");
			setCurrentEvents(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getEventos();
	}, []);

	const handleDateClick = (selected) => {
		// const title = prompt("Por favor coloque um título para o evento");
		// const calendarApi = selected.view.calendar;
		// calendarApi.unselect();
		// if (title) {
		// 	calendarApi.addEvent({
		// 		id: `${selected.dateStr}-${title}`,
		// 		title,
		// 		start: selected.startStr,
		// 		end: selected.endStr,
		// 		allDay: selected.allDay,
		// 		descricao: prazo,
		// 	});
		// }
	};

	const handleDeleteEvent = async (selected) => {
		if (
			window.confirm(
				`Você tem certeza que quer deletar esse evento? '${selected.event.title}'`
			)
		) {
			try {
				const res = await api.delete(
					`eventos/${selected.event.extendedProps._id}`
				);
				console.log(res);
				selected.event.remove();
				getEventos();
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<Box m="20px">
			<Header
				title="Agenda"
				subtitle="Controle seus prazos e seus compromissos"
			/>

			<Box display="flex" justifyContent="space-between">
				{/* CALENDAR SIDEBAR */}
				<Box
					flex="1 1 30%"
					backgroundColor={colors.primary[400]}
					p="15px"
					borderRadius="4px"
				>
					<Typography variant="h5">Eventos/Prazos</Typography>
					<List>
						{currentEvents.map((event) => (
							<ListItem
								key={event._id}
								sx={
									event.extendedProps.tipo != "prazo"
										? {
												backgroundColor: colors.greenAccent[500],
												color: colors.primary[400],
												margin: "10px 0",
												height: "100%",
												borderRadius: "2px",
										  }
										: {
												backgroundColor: pink[800],
												margin: "10px 0",
												height: "100%",
												borderRadius: "2px",
										  }
								}
							>
								<CheckBoxOutlineBlankOutlinedIcon
									sx={{ marginRight: "10px" }}
								/>
								<ListItemText
									primary={
										<Typography sx={{ fontWeight: "Bold" }}>
											{`${formatDate(event.date, {
												year: "numeric",
												month: "short",
												day: "numeric",
												locale: "pt-br",
											})} - ${event.title}`}
										</Typography>
									}
									secondary={
										<Typography>{event.extendedProps.descricao}</Typography>
									}
								/>
							</ListItem>
						))}
					</List>
				</Box>

				{/* CALENDAR */}
				<Box flex="1 1 100%" ml="15px">
					<FullCalendar
						height="80vh"
						eventDidMount={(arg) =>
							arg.event.extendedProps.tipo !== "prazo"
								? (arg.el.style.backgroundColor = colors.greenAccent[500])
								: (arg.el.style.backgroundColor = pink[800])
						}
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							interactionPlugin,
							listPlugin,
						]}
						buttonText={{
							today: "Hoje",
							month: "mês",
							week: "semana",
							day: "dia",
							list: "lista",
						}}
						headerToolbar={{
							left: "prev,next today",
							center: "title",
							right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
						}}
						initialView="dayGridMonth"
						editable={true}
						selectable={true}
						selectMirror={true}
						dayMaxEvents={true}
						select={handleDateClick}
						eventClick={handleDeleteEvent}
						events={(fetchInfo, successCallback, failureCallback) => {
							// Esta função deve retornar os eventos atuais em formato de array
							// Você pode filtrar os eventos de acordo com suas necessidades aqui
							successCallback(currentEvents);
						}}
						locale={"pt-br"} //
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Calendar;
